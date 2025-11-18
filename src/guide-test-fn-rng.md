# Testing functions which use RNGs

Occasionally a function that uses random number generators might need to be tested. For functions that need to be tested with test vectors, the following approach might be adapted:

```rust
use rand::{TryCryptoRng, rngs::OsRng};

pub struct CryptoOperations<R: TryCryptoRng = OsRng> {
    rng: R
}

impl<R: TryCryptoRng> CryptoOperations<R> {
    #[must_use]
    pub fn new(rng: R) -> Self {
        Self {
            rng
        }
    }

    pub fn xor_with_random_bytes(&mut self, secret: &mut [u8; 8]) -> [u8; 8] {
        let mut mask = [0u8; 8];
        self.rng.try_fill_bytes(&mut mask).unwrap();

        for (byte, mask_byte) in secret.iter_mut().zip(mask.iter()) {
            *byte ^= mask_byte;
        }

        mask
    }
}

fn main() {
    let rng = OsRng;
    let mut crypto_ops = <CryptoOperations>::new(rng);

    let mut secret: [u8; 8] = *b"\x00\x01\x02\x03\x04\x05\x06\x07";
    let mask = crypto_ops.xor_with_random_bytes(&mut secret);
    
    println!("Modified Secret (XORed): {:?}", secret);
    println!("Mask: {:?}", mask);
}
```

To test this, we can create a `MockCryptoRng` implementing `TryRngCore` and `TryCryptoRng` in our testing module. Note that `MockCryptoRng` is private and `#[cfg(test)] mod tests` is cfg-gated to our test environment, thus ensuring that `MockCryptoRng` cannot accidentally be used in production.

```rust,noplayground
#[cfg(test)]
mod tests {
    use super::*;

    #[derive(Clone, Copy, Debug)]
    struct MockCryptoRng {
        data: [u8; 8],
        index: usize,
    }

    impl MockCryptoRng {
        fn new(data: [u8; 8]) -> MockCryptoRng {
            MockCryptoRng {
                data,
                index: 0,
            }
        }
    }

    impl CryptoRng for MockCryptoRng {}

    impl RngCore for MockCryptoRng {
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

    #[test]
    fn test_xor_with_mock_rng() {
        let mock_crypto_rng = MockCryptoRng::new(*b"\x57\x88\x1e\xed\x1c\x72\x01\xd8");
        let mut crypto_ops = CryptoOperations::new(mock_crypto_rng);

        let mut secret: [u8; 8] = *b"\x00\x01\x02\x03\x04\x05\x06\x07";
        let mask = crypto_ops.xor_with_random_bytes(&mut secret);
        let expected_mask = *b"\x57\x88\x1e\xed\x1c\x72\x01\xd8";
        let expected_xored_secret = *b"\x57\x89\x1c\xee\x18\x77\x07\xdf";

        assert_eq!(secret, expected_xored_secret);
        assert_eq!(mask, expected_mask);
    }
}
```
