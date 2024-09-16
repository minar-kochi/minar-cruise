interface IUseInitialPath {
  pathName: string;
}

export const useInitialPath = ({ pathName }: IUseInitialPath) => {
  let parsedPath = pathName.split("/")[2];
  if (!parsedPath) {
    parsedPath = "admin";
  }
  return parsedPath;
};
