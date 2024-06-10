# BashBrawl Standalone

![Baschbrawl Screen](./src/assets/bashbrawl/bashbrawl_screen.PNG)

Test it on [bashbrawl.com](https://bashbrawl.com)

## Options:

Options that can be set to the local storage in order to modify some behaviour
(Also the /config page can be used to change some of the settings and check for health of remote score server)

- `disable_imprint` - If set it disables the imprint and privacy policy links
- `badge_scanner` - If set the user has to scan his badge before playing and the badge id will be sent to the scoreserver. May apply a cooldown after playing
- `score_server` - The URL of the remote score server. if not set or set to `local` the scores will be stored in the local storage.

## original idea

Thanks to [clh-bash](https://github.com/CommandLineHeroes/clh-bash/) for giving me the idea. Some language files were taken from there, the other code was newly written.
