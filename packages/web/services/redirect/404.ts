const redirectTo404 = () => {
  return {
    redirect: {
      destination: "/404",
      permanent: false,
    },
  };
};
export default redirectTo404;
