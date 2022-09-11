# enode-discoverer

```bash
docker run -d  --name enode-discoverer -v \
  -e "BOOT_NODES=enode://ec66ddcf1a974950bd4c782789a7e04f8aa7110a72569b6e65fcd51e937e74eed303b1ea734e4d19cfaec9fbff9b6ee65bf31dcb50ba79acce9dd63a6aca61c7@52.14.151.177:30303" \
  -e "DNS_NETWORKS=enrtree://AKA3AM6LPBYEUDMVNU3BSVQJ5AD45Y7YPOHJLEF6W26QOE4VTUDPE@all.mainnet.ethdisco.net" \
  savid/enode-discoverer:latest
```
