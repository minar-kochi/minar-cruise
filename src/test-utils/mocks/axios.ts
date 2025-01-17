import axios from "axios";

jest.mock("axios");
export const mockedAxios = axios as jest.Mocked<typeof axios>;
