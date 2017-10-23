%admin ALL=(root) NOPASSWD: /bin/launchctl load {{service}}
%admin ALL=(root) NOPASSWD: /bin/launchctl load -w {{service}}
%admin ALL=(root) NOPASSWD: /bin/launchctl unload {{service}}
%admin ALL=(root) NOPASSWD: /bin/launchctl list core.io.caddy
