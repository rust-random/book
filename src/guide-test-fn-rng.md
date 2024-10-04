# Testing functions that use RNGs

Occasionally a function that uses random number generators might need to be tested. For functions that need to be tested with test vectors, the following approach might be adapted:

```rust
use rand::{RngCore, CryptoRng, rngs::OsRng};

pub struct CryptoOperations<R: RngCore + CryptoRng + Default = OsRng> {
    rng: R
}

impl<R: RngCore + CryptoRng + Default> CryptoOperations<R> {
    #[must_use]
    pub fn new() -> Self {
        Self {
            rng: R::default()
        }
    }

    pub fn xor_with_random_bytes(&mut self, secret: &mut [u8; 8]) -> [u8; 8] {
        let mut mask: [u8; 8] = [0; 8];
        self.rng.fill_bytes(&mut mask);

        for (byte, mask_byte) in secret.iter_mut().zip(mask.iter()) {
            *byte ^= mask_byte;
        }

        mask
    }
}

fn main() {
    let mut crypto_ops = <CryptoOperations>::new();

    let mut secret: [u8; 8] = *b"\x00\x01\x02\x03\x04\x05\x06\x07";
    let mask = crypto_ops.xor_with_random_bytes(&mut secret);
    
    println!("Modified Secret (XORed): {:?}", secret);
    println!("Mask: {:?}", mask);
}
```

And as for tests, we can create a MockRng that implements RngCore and CryptoRng and provide a Default implementation with the value we want to return. Notice that the MocRng struct is marked with `#[cfg(test)]` as to not allow tainting the valid usages of the `xor_with_random_bytes` function:

```rust
#[cfg(test)]
#[derive(Clone, Copy, Debug)]
struct MockRng {
    data: [u8; 8],
    index: usize,
}

#[cfg(test)]
impl Default for MockRng {
    fn default() -> MockRng {
        MockRng {
            data: *b"\x57\x88\x1e\xed\x1c\x72\x01\xd8",
            index: 0,
        }
    }
}

#[cfg(test)]
impl CryptoRng for MockRng {}

#[cfg(test)]
impl RngCore for MockRng {
    fn next_u32(&mut self) -> u32 {
        unimplemented!()
    }

    fn next_u64(&mut self) -> u64 {
        unimplemented!()
    }

    fn fill_bytes(&mut self, dest: &mut [u8]) {
        for byte in dest.iter_mut() {
            *byte = self.data[self.index];
            self.index = (self.index + 1) % self.data.len();
        }
    }

    fn try_fill_bytes(&mut self, dest: &mut [u8]) -> Result<(), rand::Error> {
        unimplemented!()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_xor_with_mock_rng() {
        let mut crypto_ops = CryptoOperations::<MockRng>::new();
        let mut secret: [u8; 8] = *b"\x01\x01\x02\x03\x04\x05\x06\x07";

        let mask = crypto_ops.xor_with_random_bytes(&mut secret);
        let expected_mask = *b"\x57\x88\x1e\xed\x1c\x72\x01\xd8";
        let expected_xored_secret = *b"\x57\x89\x1c\xee\x18\x77\x07\xdf";

        assert_eq!(secret, expected_xored_secret);
        assert_eq!(mask, expected_mask);
    }
}
```