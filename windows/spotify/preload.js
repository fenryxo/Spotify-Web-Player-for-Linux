/*
 * @author Matthew James <Quacky2200@hotmail.com>
 * Spotify Player Injection tool
 * Allows for Spotify Web Player for Linux to implement native-like features
 */
require('electron-cookies');
window.windowHook = false;
window.remote = require('electron').remote;
window.require = require;
window._loaded = false;
//If the window is a pop-up window
if (window.opener){
  var popupWindow = remote.getCurrentWindow();
  //Set our default properties for the popup window and escape.
  popupWindow.setSize(800, 600);
  popupWindow.setMenu(null);
  popupWindow.show();
  return;
}
/*
 * Make sure to run everything when we are ready
 */
document.onreadystatechange = function(){
  window.props = remote.getGlobal('props');
  window.$ = window.jQuery = require('./jquery');
  window.interface = require('./interface');
  if (_loaded) return;
  //Load our theming
  interface.refresh();
  /*
   * Check for any updates and show an update button when one is available
   */
  function checkForUpdates(){
    $.getJSON("https://api.github.com/repos/Quacky2200/Spotify-Web-Player-for-Linux/releases", (data) => {
      var updateAvailable = (() => {
        var version_update_tag = data[0].tag_name.match(/([0-9\.]+)/)[1].split('.');
        var version_now_tag = props.electron.app.getVersion().match(/([0-9\.]+)/)[1].split('.');
        for(var num in version_update_tag){
          if(parseInt(version_update_tag[num]) > parseInt(version_now_tag[num])) {
            return true;
          } else if (parseInt(version_update_tag[num]) < parseInt(version_now_tag[num])){
            return false
          }
        }
      })();
      if(updateAvailable){
        var updateAvailableButtonIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAA21BMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAABm7yWAAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfgCRsAHhHuaRzgAAAD9ElEQVR42u2dvY7aQBhF50oUrqjcrKjpqFZCgnbe/6GiREqyq7AbsOf7m3vPA4DPsTFmZmxaE0IIIYQQQgghhBBCCCGEEEIIIYQI4oBPHBZa9Y8cmeUJIqx4lhnt3/ASp8n0sQFy/YkSYAcT6J+xD+bdP8HpEENg9wdWbv2qBwHAXQCDOdfSv2A8TF/+1QvACHb/KgUA7gIAd4EjuAu8A9wFzP3TXBFdrp+G9d38MxwCX47uLsD0BW5IQJj9HTlYZz2/pT4EkApyffeRUuSDXN+1ALgDIC3s/mD39yhwB3eAFaAuAHAHyO//ZxCC1d/0EFjJA9wB7gIgDwDyAGX8jdYVoxAKQO4Pdn+Lk0CtAGD3VwB2fwVYyP1HjwnUCwB2fwVgHAYxCwAF4A5wYw/gs0EKoABZA6zsAaAAFQMc2AM0BRjFpWaAy7AA16InQST7BPgHGLV4vm6AQQdB5QBDFo+XDjDiICgeAPQBQB9g74mgfgBc2QPs+Bic/bYh4Qjhu+smpBsjPTlvgXGAV+8tX913gfUw+Us/D28Bx2CmiYKQ988zVRL09mkmizBvAATqVwmAuQOEbkSOOfjEl+PxAToIAiDMP0uAc5R/lgBfbccClgDIeiEaGwBEAZD0KiwyALgCwGoCvGwAsAW4JLsE81+PG7IQNm0AEAZY81yABS1JV4Ac119xAQ7sAWDwrm/NlJ4+AHohf5gcdr2O/++TAIoU6EYngeGv28v4w+jE26v4WwWwKGAzXPvzlU3uiO01/GF36dFL+P/6GkCBAnbTFYYXn72CPyz/9qUX8Ifpr4+e3982wJgCttOVxr8/e3Z/6wD7C5hP11u/Qc/tD/sH5PbU/nAYguqZ/T0CbC/g4O8SYGsBD3+fANsKuPg7BdhSwMffK8DrBZz8D24TET2lPxa/mZie0R+eU1E9ob9rgOcL+Pn7Bni2gKO/c4DnCnj6H8c9HGVYAU9/uK0OfL6Aq7/htMDWAr7+EQG+L+Dsf4wI8F0BZ3+zqdGtBbz9YXSD+NYC7v5oQYfA4wJR/iGPC+4Z/CMD/FsgwP/kvE782wIB/ghanPmwQIR/dICPBWL9wx6b30P9Q9bKPy4Q7h/33Pwe5x9zv8yjAhn8A/86oQf5o2UpkMOfLsCpkRdo5AHib1aKZWUPkOF+tXz+PAUaeYBzIy+Q57bVfP4MBf4zM3kn9w+ZJUnlP/mHIPRhqlX8Jy4Q+Djt5Nc/FN8FLy7UZfefrcCW/5qi3v1zJThuvmOJevfPkmD3favk+rUTDHt6QUn7UxvJnXbn+z9xM/Jrb4JfSYbyf58+fE2pfliaEEIIIYQQQgghhBBCCCGEEEIIIcRjfgDj86cKVDgsEwAAAABJRU5ErkJggg==';
        button = `
          <li>
            <a id="nav-update" style='padding: 5px' class="standard-menu-item" data-href="${data[0].html_url}">
              <img src='${updateAvailableButtonIcon}' style='padding: 5px;height: 70%;margin: auto;display: block;opacity: 0.4;'/>
              <span class="nav-text">Update</span>
            </a>
          </li>
          <style>
          #nav-update.active img{
            opacity: 0.9;
          }
          </style>
        `;
        $('#main-nav #nav-items').append(button);
        $('#nav-update').click(function(){
          props.electron.shell.openExternal($(this).attr('data-href'));
        });
      }
    });
  }
  /*
   * Handler for JSON messages from Spotify
   */
  function onMessage(e){
    if(!(typeof e.data == 'string')) return
    if (e.data.indexOf('USER_ACTIVE') > 0 || e.data.indexOf("spb-connected") > 0){
      //Whenever the user is active (or when the whole interface is loaded)
      var loggedIn = user.isLoggedIn();
      //Try to prevent the window from moving away now that we're logged in
      windowHook = loggedIn;
      //Make sure to optionally show the Spotify tray icon
      tray.toggleTray(loggedIn && props.settings.ShowTray);
      //Make sure to optionally show the application menu
      appMenu.toggleMenu(loggedIn && props.settings.ShowApplicationMenu);
      //Make sure to set persistence
      if (props.settings.lastURL !== window.location.href){
        props.settings.lastURL = window.location.href;
        props.settings.save();
      }
    } else if (e.data.indexOf("user:impression") > 0){
      if(e.data.indexOf('player_loaded') > -1) {
        require('./shortcut-bar');
        var Controller = require('./controller');
        window.controller = new Controller(document.getElementById('app-player'));
        var isFocusWorthy = () => {
          return (props.settings.Notifications.OnlyWhenFocused ? !props.spotify.isFocused() : true);
        };
        controller.albumCache = props.paths.caches.albums;
        controller.albumCacheDisabled = props.settings.AlbumCacheDisabled;

        controller.on('Quit', () => {
          tray.contextMenu.quit.click();
        });

        controller.on('Raise', () => {
          props.spotify.show();
          props.spotify.focus();
        });

        controller.on('trackChange', (controller) => {
          sing.toggleButton(true);
          interface.refresh();
          tray.toggleMediaButtons(controller.status !== 'Stopped');
          sing.load(controller.track.id, controller.track.name, controller.track.artists);
          if(isFocusWorthy() && props.settings.Notifications.ShowTrackChange) controller.notify();
        });

        controller.on('playbackChange', (controller) => {
          var notificationSwitchTable = {
            Playing: props.settings.Notifications.ShowPlaybackPlaying,
            Paused: props.settings.Notifications.ShowPlaybackPaused,
            Stopped: props.settings.Notifications.ShowPlaybackStopped
          };
          var isMediaSwitchable = controller.status != 'Stopped';
          if(isFocusWorthy() && notificationSwitchTable[controller.status]) controller.notify();
          sing.toggleButton(isMediaSwitchable);
          sing.load(controller.track.id, controller.track.name, controller.track.artists);
          tray.toggleMediaButtons(isMediaSwitchable);
          controller.toggleGlobalMediaButtons(isMediaSwitchable);
        });
      }
      interface.refresh();
    }
  }
  //Make sure we don't get stuck when we cannot connect to Spotify
  setInterval(() => {
    if($('#modal-notification-area').is(':visible')) {
      windowHook = false;
      window.location.reload();
    }
  }, 10000);
  /**
   * When the window closes, hide or close depending on preferred behaviour
   */
  window.onbeforeunload = function(e) {
    var alreadyHidden = props.spotify.isVisible() && !props.spotify.isMinimized();
    if(windowHook && alreadyHidden && ((props.settings.CloseToTray && props.settings.ShowTray) || props.settings.CloseToController)){
      props.spotify.hide();
      return false;
    } else if (windowHook && alreadyHidden && props.settings.CloseToTray && !props.settings.ShowTray){
      props.spotify.minimize();
      return false;
    }
    controller.dispose();
    appMenu.toggleMenu(false);
    tray.toggleTray(false);
  };
  window.user = require('./user');
  window.tray = require('./tray');
  window.sing = require('./Sing!/sing');
  window.appMenu = require('./window-menu');
  //Check for message events from Spotify
  window.addEventListener('message', onMessage);
  checkForUpdates();
  //Check for updates every 6 hours (1/4 day)
  setInterval(checkForUpdates, 2.16e+7);
  _loaded = true;
}
