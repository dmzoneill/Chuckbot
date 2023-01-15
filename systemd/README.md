# Systemd service

Install the service
```
cp chuckbot.service ~/.config/systemd/user/chuckbot.service
```

Reload dameon definitions
```
systemctl daemon-reload
```

Enable chuckbot service
```
systemctl --user enable chuckbot.service
```

Restart the service
```
systemctl --user restart chuckbot.service
```

Check the service
```
systemctl --user status chuckbot.service
```


