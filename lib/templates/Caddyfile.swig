# File generated automatically by core.io
# name: {{name}}
# proxy: {{ proxy }}
# domain: {{ domain }}

http://{{ domain }} {
	proxy / {{ proxy }} {
		transparent
		websocket
		fail_timeout 0s
	}
}

# https://{{ domain }} {
# 	proxy / {{ proxy }} {
# 		transparent
# 		websocket
# 		fail_timeout 0s
# 	}
# }
