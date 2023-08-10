export const RenderIf = (props: {
  condition: boolean;
  children: React.ReactNode;
}) => {
  if (props.condition) {
    return props.children;
  } else {
    return null;
  }
};
