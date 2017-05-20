/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2017
 */
/** --------------------------------------- Modules --------------------------------------- **/
//---- Electron ----
const {
  ipcRenderer,
  screen
} = require('electron');

//---- Node ----
const path = require('path');

//---- Own ----
const {
  coloursFile,
  configFile,
  langFile,
  editFile
} = require(path.join(__dirname, '../../../', 'config')).init();
const $ = require(path.join(__dirname, '../../../', 'dom'));

/* --------------------------------- Variables --------------------------------- */
let lang = langFile[configFile.lang];
let option = null;

/** --------------------------------------- Functions --------------------------------------- **/
function displayOption() {
  ['#theme-colours', '#idiom', '#screen-size'].forEach(function (v) {
    $(v).addClass('hide');
  });

  switch (this.value) {
    case '1': showColoursTheme(); break;
    case '2': showLanguage(); break;
    case '3': showScreenSize(); break;
  }
}

// Change the size of the screen
function enableScreenSize() {
  // enable the screen sizer
  if ($(this).has('unchecked-colour') && $(this).data('screen') === 'show-size') {
    $(this).switchClass('unchecked-colour', 'checked-colour');
  }
  // ipcRenderer.send('change-screen-size', screen.getPrimaryDisplay().workArea);
}

function showScreenSize() {
  $('#screen-size').removeClass('hide');
  $('.unchecked-colour').on({ click: enableScreenSize });
}

// Change the idiom of the app
function showLanguage() {
  $('#idiom').removeClass('hide');
  let i = '';
  switch (configFile.lang) {
    case 'es': i = 'Español<div class="checked-colour"></div>'; break;
    case 'us': i = 'English<div class="checked-colour"></div>'; break;
    case 'de': i = 'Deutsch<div class="checked-colour"></div>'; break;
  }

  $(`#${configFile.lang}`).text(i).css('background:#fcfcfc');
}

function choosenIdiom() {
  configFile.lang = this.id;
  editFile('config', configFile);

  let i = '';
  switch (configFile.lang) {
    case 'es': i = 'Español'; break;
    case 'us': i = 'English'; break;
    case 'de': i = 'Deutsch'; break;
  }

  $(`#${configFile.lang}`).text(i).rmAttr('style');

  $(`#${this.id}`).text(`${i}<div class="checked-colour"></div>`)
    .css('background:#fcfcfc');

  setTimeout(function () {
    ipcRenderer.send('restart-app');
  }, 460);
}

// Change the color of the app
function showColoursTheme() {
  $('#theme-colours').removeClass('hide');
  $(`#${configFile.theme}`).text('<div class="checked-colour"></div>');
}

function choosenColor() {
  $(`#${configFile.theme}`).empty();
  configFile.theme = this.id;
  editFile('config', configFile);
  editFile(path.join(__dirname, '../../../../css', 'color.css'), coloursFile[this.id], true);
  $(`#${this.id}`).text('<div class="checked-colour"></div>');
}

function showConfigurations() {
  $($('.grid-container').get(0)).css('-webkit-filter:blur(1px)');
  $('#_configurations').text(lang.config.configurations);

  const fragment = document.createDocumentFragment();
  option = document.createElement('option');

  lang.config.configurationsOpt.forEach(function (o, i) {
    fragment.appendChild(
      $(option.cloneNode(false)).val(i).text(o).get()
    );
  });

  $('#config-options')
    .append(fragment)
    .on({ click: displayOption });

  // Colours options
  const coloursNames = Object.keys(coloursFile);
  $('.colour-name').each(function (v, i) {
    $(v).text(coloursNames[i]);
  });

  $('.colour').on({ click: choosenColor });

  // idiom.
  $('.idiom-item').on({ click: choosenIdiom });

  $($('.parent-container-config').get(2))
    .removeClass('hide')
    .child(0)
    .addClass('container-config-anim');
}

function close() {
  option = null;
}

module.exports = Object.freeze({
  showConfigurations,
  close
});