## core.io-cli-local-env

core.io cli tool to manage local environments for development.

## Local Development Environment

### CLI 

```
   shuttle 0.0.1 - CLI utility to create local development environments

   USAGE

     shuttle <command> [options]

   COMMANDS

     install                     Install all dependencies
     list                        List all local domains
     open <domain>               Open domain in default browser
     share <project>             Generate a shareable URL for a project
     restart                     Restart Caddy and Dnsmasq services
     stop                        Stop Caddy and Dnsmasq services
     start                       Start Caddy and Dnsmasq services
     serve <domain> <proxy>      Proxy a local domain and save it for quick access
     update                      Update toolchain
     help <command>              Display help for a specific command

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages

   MORE INFO

     This program uses Caddy server and Dnsmasq. It generates various files and uses brew to install dnsmasq.
```     

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


### Credits

This is a rework of [marina-cli][marina-cli] with small modifications to suit a different setup.

## License
® License MIT by goliatone
