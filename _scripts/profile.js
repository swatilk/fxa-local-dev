var path = require('path');
var chalk = require('chalk');

var CONFIGS = {
  'local': {
    auth: 'http://127.0.0.1:9000/v1',
    content: 'http://127.0.0.1:3030/',
    token: 'http://localhost:5000/token/1.0/sync/1.5',
    loop: 'http://localhost:10222',
    oauth: 'http://127.0.0.1:9010/v1',
    profile: 'http://localhost:1111/v1'
  },
  'latest': {
    auth: 'https://latest.dev.lcip.org/auth/v1',
    content: 'https://latest.dev.lcip.org/',
    token: 'https://latest.dev.lcip.org/syncserver/token/1.0/sync/1.5',
    oauth: 'https://oauth-latest.dev.lcip.org/v1',
    profile: 'https://latest.dev.lcip.org/profile/v1'
  },
  'stable': {
    auth: 'https://stable.dev.lcip.org/auth/v1',
    content: 'https://stable.dev.lcip.org/',
    token: 'https://stable.dev.lcip.org/syncserver/token/1.0/sync/1.5',
    oauth: 'https://oauth-stable.dev.lcip.org/v1',
    profile: 'https://stable.dev.lcip.org/profile/v1'
  },
  'stage': {
    auth: 'https://api-accounts.stage.mozaws.net/v1',
    content: 'https://accounts.stage.mozaws.net/',
    token: 'https://token.stage.mozaws.net/1.0/sync/1.5',
    oauth: 'https://oauth.stage.mozaws.net/v1',
    profile: 'https://profile.stage.mozaws.net/v1'
  },
  'prod': {
    auth: 'https://api.accounts.firefox.com/v1',
    content: 'https://accounts.firefox.com/',
    token: 'https://token.services.mozilla.com/1.0/sync/1.5',
    oauth: 'https://oauth.accounts.firefox.com/v1',
    profile: 'https://profile.accounts.firefox.com/v1'
  }
};

var env = process.env.FXA_ENV || 'local';
var FXA_DESKTOP_CONTEXT = process.env.FXA_DESKTOP_CONTEXT || 'fx_desktop_v2';
var e10s = process.env.FXA_E10S === 'true';
var fxaEnv = CONFIGS[env];

var fxaProfile = {
  // enable debugger and toolbox
  'devtools.chrome.enabled': true,
  'devtools.debugger.remote-enabled': true,
  'devtools.debugger.prompt-connection': false,
  // disable signed extensions
  // the WebDriver extension will not work in Nightly because signed extensions are forced
  'xpinstall.signatures.required': false,
  'xpinstall.whitelist.required': false,
  'services.sync.prefs.sync.xpinstall.whitelist.required': false,
  'extensions.checkCompatibility.nightly': false,
  // enable pocket
  'browser.pocket.enabled': true,
  // identity logs
  'identity.fxaccounts.log.appender.dump': 'Debug',
  'identity.fxaccounts.loglevel': 'Debug',
  'services.sync.log.appender.file.logOnSuccess': true,
  'services.sync.log.appender.console': 'Debug',
  'services.sync.log.appender.dump': 'Debug',
  'identity.fxaccounts.auth.uri': fxaEnv.auth,
  'identity.fxaccounts.allowHttp': true,
  'identity.fxaccounts.remote.force_auth.uri': fxaEnv.content + 'force_auth?service=sync&context=' + FXA_DESKTOP_CONTEXT,
  'identity.fxaccounts.remote.signin.uri': fxaEnv.content + 'signin?service=sync&context=' + FXA_DESKTOP_CONTEXT,
  'identity.fxaccounts.remote.signup.uri': fxaEnv.content + 'signup?service=sync&context=' + FXA_DESKTOP_CONTEXT,
  'identity.fxaccounts.remote.webchannel.uri': fxaEnv.content,
  'identity.fxaccounts.remote.oauth.uri': fxaEnv.oauth,
  'identity.fxaccounts.remote.profile.uri': fxaEnv.profile,
  'identity.fxaccounts.settings.uri': fxaEnv.content + 'settings?service=sync&context=' + FXA_DESKTOP_CONTEXT,
  // for some reason there are 2 settings for the token server
  'identity.sync.tokenserver.uri': fxaEnv.token,
  'services.sync.tokenServerURI': fxaEnv.token,
  // disable auto update
  'app.update.auto': false,
  'app.update.enabled': false,
  'app.update.silent': false,
  'app.update.staging.enabled': false,
};


// Configuration for local sync development

// The loop server is either production or local, nothing on stable or latest
if (fxaEnv.loop) {
  fxaProfile['loop.server'] = fxaEnv.loop;
}

if (! e10s) {
  // disable e10s
  fxaProfile['browser.tabs.remote.autostart'] = false;
  fxaProfile['browser.tabs.remote.autostart.1'] = false;
  fxaProfile['browser.tabs.remote.autostart.2'] = false;
}

console.log(chalk.yellow('Configuration:', JSON.stringify(fxaEnv, null, 2)));
console.log(chalk.yellow('E10S Status:', e10s));
console.log(chalk.yellow('FXA_ENV:', env));
console.log(chalk.yellow('FIREFOX_BIN Binary:', process.env.FIREFOX_BIN || 'Default System Firefox binary'));
console.log(chalk.yellow('FXA_DESKTOP_CONTEXT:', FXA_DESKTOP_CONTEXT));
console.log(chalk.yellow('FIREFOX_DEBUGGER:', !! process.env.FIREFOX_DEBUGGER));

module.exports = fxaProfile;
