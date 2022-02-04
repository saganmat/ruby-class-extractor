'use babel';

import RubyClassExtractorView from './ruby-class-extractor-view';
import { CompositeDisposable } from 'atom';

export default {

  rubyClassExtractorView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.rubyClassExtractorView = new RubyClassExtractorView(state.rubyClassExtractorViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.rubyClassExtractorView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'ruby-class-extractor:extract': () => this.extract()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.rubyClassExtractorView.destroy();
  },

  serialize() {
    return {
      rubyClassExtractorViewState: this.rubyClassExtractorView.serialize()
    };
  },

  extract() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let matches = selection.match(/(class|module)\s+(\w+)(:+\w+)*/g);
      let result = matches.map(element => element.replace(/(class|module)\s+/g, "")).join("::");
      atom.clipboard.write(result)
    }
  }

};
