export const useLoadingState = () => {
  const $isLoading = useState('isLoading', () => false);

  const setLoading = (loading: boolean) => {
    $isLoading.value = loading;
  };

  return {
    $isLoading,
    setLoading,
  };
};
