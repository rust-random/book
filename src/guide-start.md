# Getting started

If you haven't already, [install Rust](https://www.rust-lang.org/learn/get-started).

Next, lets make a new crate and add rand as a dependency:
```sh
cargo new randomly
cd randomly
cargo add rand --features small_rng
```

Now, paste the following into `src/main.rs`:
```rust
use rand::prelude::*;

fn main() {
    let mut rng = rand::thread_rng();

    println!("Random die roll: {}", rng.gen_range(1..=6));
    println!("Random UUID: 0x{:X}", rng.gen::<u128>());

    if rng.gen() {
        println!("You got lucky!");
    }
}
```

Now lets go!
```sh
$ cargo run
   Compiling [..]
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.99s
     Running `target/debug/randomly`
Random die roll: 4
Random UUID: 0xEC3936A465339F8295EE11AB853CCDBF
You got lucky!
```

## Other crates

Some other [crates](crates.md) are used by this guide. When needed, you can either edit the `[dependencies]` section of your `Cargo.toml` or use `cargo add`:
```sh
$ cargo add rand_distr
    Updating crates.io index
      Adding rand_distr v0.4.3 to dependencies
             Features:
             + alloc
             + std
             - serde
             - serde1
             - std_math
    Updating crates.io index
```
