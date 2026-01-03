import { useCallback, useEffect } from 'react';
import { useAppStore } from '../../hooks/useStore';
import { store } from '../../store';

export function SaveDialog() {
  const dialog = useAppStore((state) => state.ui.dialog);
  const closeDialog = useCallback(() => {
    store.getState().closeDialog();
  }, []);

  // Update browser history when success dialog is shown
  useEffect(() => {
    if (dialog.isOpen && dialog.type === 'success' && dialog.url) {
      let text: string;
      let title: string;

      if (dialog.songTitle) {
        if (dialog.userName) {
          text = '"' + dialog.songTitle + '" by ' + dialog.userName;
        } else {
          text = '"' + dialog.songTitle + '"';
        }
        title = text + ' :: evil';
      } else {
        title = 'evil';
      }

      history.pushState('', title, dialog.url);
      document.title = title;
    }
  }, [dialog.isOpen, dialog.type, dialog.url, dialog.songTitle, dialog.userName]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === 'dialog') {
      closeDialog();
    }
  }, [closeDialog]);

  const getFullUrl = () => {
    return 'http://evil.gmork.in/' + dialog.url;
  };

  const getTwitterUrl = () => {
    const url = getFullUrl();
    let text = '"evil" by gmork';
    if (dialog.songTitle) {
      if (dialog.userName) {
        text = '"' + dialog.songTitle + '" by ' + dialog.userName;
      } else {
        text = '"' + dialog.songTitle + '"';
      }
    }
    return 'http://twitter.com/intent/tweet?url=' + encodeURI(url + '&text=' + text + '&hashtags=evil');
  };

  const getFacebookUrl = () => {
    return 'http://www.facebook.com/sharer.php?&u=' + getFullUrl();
  };

  const handleFacebookClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.open(
      getFacebookUrl(),
      'Share on facebook',
      'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1'
    );
    closeDialog();
  }, [closeDialog]);

  return (
    <div
      id="dialog"
      style={{
        opacity: dialog.isOpen ? 1 : 0,
        zIndex: dialog.isOpen ? 10000 : -10000,
      }}
      onClick={handleBackdropClick}
    >
      <div id="dialog-wrapper">
        {dialog.type === 'success' && (
          <div id="dialog-success" className="dialog-message">
            <i className="fa fa-check dialog-icon"></i>
            <div className="dialog-message-main">Saved!</div>
            <div className="dialog-message-sub">{getFullUrl()}</div>
          </div>
        )}

        {dialog.type === 'error' && (
          <div id="dialog-error" className="dialog-message">
            <i className="fa fa-frown-o dialog-icon"></i>
            <div className="dialog-message-main">Failed.</div>
            <div className="dialog-message-sub">Hmm... something's going wrong.</div>
          </div>
        )}

        {dialog.type === 'success' && (
          <div id="dialog-socials" className="clearfix">
            <a
              className="dialog-twitter dialog-social fa fa-twitter"
              href={getTwitterUrl()}
              onClick={closeDialog}
            ></a>
            <a
              className="dialog-facebook dialog-social fa fa-facebook"
              href={getFacebookUrl()}
              onClick={handleFacebookClick}
            ></a>
          </div>
        )}

        <i className="fa fa-times dialog-close" onClick={closeDialog}></i>
      </div>
    </div>
  );
}
