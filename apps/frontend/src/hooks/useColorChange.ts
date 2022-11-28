import useColorChange from "use-color-change";

export const useFlashOnChange = (value: number) => {
  return useColorChange(value, {
    higher: "limegreen",
    lower: "crimson",
    duration: 2500,
  });
};
