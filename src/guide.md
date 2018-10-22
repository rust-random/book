# Guide


```rust
extern crate rand;

use rand::prelude::*;

fn main() {
  // basic usage with random():
  let x: u8 = random();
  println!("{}", x);

  let y = random::<f64>();
  println!("{}", y);

  if random() { // generates a boolean
      println!("Heads!");
  }

  // normal usage needs both an RNG and a function to generate the appropriate
  // type, range, distribution, etc.
  let mut rng = thread_rng();
  if rng.gen() { // random bool
      let x: f64 = rng.gen(); // random number in range [0, 1)
      println!("x is: {}", x);
      let ch = rng.gen::<char>(); // Sometimes you need type annotation
      println!("char is: {}", ch);
      println!("Number from 0 to 9: {}", rng.gen_range(0, 10));
  }
}
```
