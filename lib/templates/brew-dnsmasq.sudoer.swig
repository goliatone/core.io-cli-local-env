Cmnd_Alias BREW_START = /usr/local/bin/brew services start {{service}}
Cmnd_Alias BREW_STOP = /usr/local/bin/brew services stop {{service}}
Cmnd_Alias BREW_RESTART = /usr/local/bin/brew services restart {{service}}
%admin ALL=(root) NOPASSWD: BREW_START
%admin ALL=(root) NOPASSWD: BREW_STOP
%admin ALL=(root) NOPASSWD: BREW_RESTART
