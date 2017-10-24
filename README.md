## core.io-cli-local-env

This is a sample project. To get started:

```
$ npm i core.io-cli-local-env
```

NOTE: This is a rework of [marina-cli][marina-cli] with small modifications to suit a different setup.

## Local Development Environment

### MacOS

#### Local domains

Since browsers [started forcing][1] **.dev** domains to HTTPS via preloaded HSTS
it became apparent that using **.dev** for local development might not be a good idea.

Another popular option are **.local** domains, but those might have name resolution issues with multicast DNS software- e.g. Bonjour.

We are going to use **.test** domains.

For each development domain you want to support you need to create a entry in your mac's resolvers directory- you might need to create the directory if not present:

```
$ sudo mkdir /etc/resolver
```

Create a file with the name of the domain, **test** in our case, and add the following line `nameserver 127.0.0.1`. A quick way of doing this:

```
$ sudo echo "nameserver 127.0.0.1" > /etc/resolver/test
```

After you add the file if you `scutil --dns` you should see an entry:

```
resolver #11
  domain   : test
  nameserver[0] : 127.0.0.1
  flags    : Request A records, Request AAAA records
  reach    : Reachable, Local Address, Directly Reachable Address
```

#### Reverse Proxy

We use [Caddy][caddy] server as a reverse proxy.

Caddy is distributed as a single binary file and has a simple configuration similar to nginx's.

#### DNS
Dnsmasq is a lightweight DNS forwarder and DHCP server. We use [dnsmasq][dnsmasq] for DNS resolution.

[1]:https://ma.ttias.be/chrome-force-dev-domains-https-via-preloaded-hsts/
[caddy]:https://caddyserver.com/
[dnsmasq]: http://www.thekelleys.org.uk/dnsmasq/doc.html
[marina-cli]: https://github.com/shnhrrsn/marina-cli

#### Ngrok
Ngrok is used to share local URLs.

## License
® License MIT by goliatone
