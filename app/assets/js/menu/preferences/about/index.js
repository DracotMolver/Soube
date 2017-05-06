/**
 * @author Diego Alberto Molina Vera.
 * @copyright 2016 - 2017
 */
/** --------------------------------------- Modules --------------------------------------- **/
//---- Node ----
const path = require('path');

//---- Electron ----
const shell = require('electron').shell;

//---- Own ----
const {
  configFile,
  langFile
} = require(path.join(__dirname, '../../../', 'config')).init();
const $ = require(path.join(__dirname, '../../../', 'dom'));

/* --------------------------------- Variables --------------------------------- */
let lang = langFile[configFile.lang];

/** --------------------------------------- Functions --------------------------------------- **/
function showAbout() {
  $($('.grid-container').get(0)).css('-webkit-filter:blur(1px)');
  $('#_about').text(lang.aboutContent);

  $(':a').on({
    click: function (e) {
      e.preventDefault();
      shell.openExternal(this.href);
    }
  });
  
  $($('.parent-container-config').get(3))
    .removeClass('hide')
    .child(0)
    .addClass('container-config-anim');
}

module.exports = Object.freeze({
  showAbout
});