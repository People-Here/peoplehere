import { IonModal, IonText } from '@ionic/react';
import { useRef } from 'react';

type Button = {
  text: string;
  onClick?: () => void;
};

type Props = {
  trigger: string;
  title: string;
  subTitle?: string;
  buttons: Button[];
  bottomText?: string;
  onClickBottomText?: () => void;
};
const Alert = ({ trigger, title, subTitle, buttons, bottomText, onClickBottomText }: Props) => {
  // eslint-disable-next-line no-undef
  const alertRef = useRef<HTMLIonModalElement>(null);

  const dismissAlert = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    alertRef.current?.dismiss();
  };

  return (
    <IonModal
      ref={alertRef}
      trigger={trigger}
      style={{
        '--backdrop-opacity': '0.6',
        '--width': 'fit-content',
        '--min-width': '17rem',
        '--height': 'fit-content',
        '--min-height': '8.25rem',
        '--border-radius': '16px',
      }}
    >
      <div className="flex flex-col gap-5 p-5 pt-6">
        {/* content */}
        <div className="flex flex-col gap-1.5">
          <IonText className="text-center whitespace-pre-line font-subheading1 text-gray8">
            {title}
          </IonText>
          {subTitle ? (
            <IonText className="text-center whitespace-pre-line font-body2 text-gray6">
              {subTitle}
            </IonText>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          {/* buttons */}
          {buttons.length === 1 ? (
            <SingleButton button={buttons[0]} closeAlert={dismissAlert} />
          ) : (
            <DoubleButton buttons={buttons} closeAlert={dismissAlert} />
          )}

          {/* bottom text */}
          {bottomText ? (
            <IonText
              className="font-caption2 text-gray5.5 underline text-center"
              onClick={onClickBottomText}
            >
              {bottomText}
            </IonText>
          ) : null}
        </div>
      </div>
    </IonModal>
  );
};

const SingleButton = ({ button, closeAlert }: { button: Button; closeAlert: () => void }) => {
  return (
    <button
      className="w-full button-primary button-md"
      onClick={() => {
        button.onClick?.();
        closeAlert();
      }}
    >
      {button.text}
    </button>
  );
};

const DoubleButton = ({ buttons, closeAlert }: { buttons: Button[]; closeAlert: () => void }) => {
  return (
    <div className="flex gap-2.5">
      <button
        className="flex-1 button-line button-md text-gray6 font-body1"
        onClick={() => {
          buttons[0].onClick?.();
          closeAlert();
        }}
      >
        {buttons[0].text}
      </button>
      <button
        className="flex-1 text-white button-primary button-md font-body1"
        onClick={() => {
          buttons[1].onClick?.();
          closeAlert();
        }}
      >
        {buttons[1].text}
      </button>
    </div>
  );
};

export default Alert;
