# CLI
```
USAGE:
    service-broker [OPTIONS]
OPTIONS:
    -h, --help                  
    -k, --key
    -c, --config=[path]
    -v, --versions
```

# Download
```
wget -O service-broker-x86_64-ubuntu https://github.com/danavation/releases/blob/service-broker/service-broker-x86_64-ubuntu?raw=true
```

# Cross-Build
## ubuntu 20.04 build for pi zero (arm-unknown-linux-gnueabihf)
* ```sudo apt install build-essential gcc-arm-linux-gnueabihf -y```
* update $HOME/.cargo/config.toml
```
[target.armv7-unknown-linux-gnueabihf]
linker = "arm-linux-gnueabihf-gcc"
```
* cargo build --release --target=arm-unknown-linux-gnueabihf
