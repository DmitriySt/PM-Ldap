import { Logo } from "components/ui/logo/logo";
import { FC, useRef } from "react";
import styles from "./loader.module.scss";
import { CSSTransition } from "react-transition-group";

interface ILoaderProps {
  show: boolean;
}

export const Loader: FC<ILoaderProps> = ({ show }) => {
  const nodeRef = useRef(null);
  return (
    <>
      <CSSTransition
        nodeRef={nodeRef}
        in={show}
        timeout={500}
        unmountOnExit={true}
        enter={true}
        classNames={{
          exit: styles.loaderExit,
          exitActive: styles.loaderExitActive,
        }}
      >
        <div className={styles.loaderContainer} ref={nodeRef}>
          <Logo />
          <div className={styles.loader}>
            <div className={styles.loaderItem}></div>
            <div className={styles.loaderItem}></div>
            <div className={styles.loaderItem}></div>
            <div className={styles.loaderItem}></div>
            <div className={styles.loaderItem}></div>
            <div className={styles.loaderItem}></div>
          </div>
        </div>
      </CSSTransition>
    </>
  );
};
