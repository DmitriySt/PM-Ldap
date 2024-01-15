import { getPasswordGroupTreeAction } from "modules/password/password-group-actions";
import { passwordGroupActions } from "modules/password/password-group-reducer";
import { selectPasswordGroup } from "modules/password/password-selectors";
import { useCallback, useEffect } from "react";
import { useStore } from "react-redux";
import { RootState } from "store/store";
import { useAppDispatch, useAppSelector } from "store/store-hooks";

export function usePasswordGroup() {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const { groupTree, passwordGroup, groupTreeOpen } =
    useAppSelector(selectPasswordGroup);
  const { setPasswordGroup, setGroupTreeOpen } = passwordGroupActions;
  const updatePasswordGroup = useCallback(
    () => dispatch(getPasswordGroupTreeAction()),
    [dispatch],
  );

  const groupTreeToggle = () => {
    dispatch(setGroupTreeOpen(!groupTreeOpen));
  };

  useEffect(() => {
    const isLoading = store.getState().passwordGroupReducer.groupTree.isLoading;
    const data = store.getState().passwordGroupReducer.groupTree.data;
    if (!isLoading && data.length === 0) {
      updatePasswordGroup();
    }
  }, [store, updatePasswordGroup]);

  return {
    groupTree,
    passwordGroup,
    setPasswordGroup,
    updatePasswordGroup,
    groupTreeOpen,
    groupTreeToggle,
  };
}
