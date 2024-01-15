import axios from "axios";

export { AxiosError } from "axios";

const mockAxios = jest.genMockFromModule("axios") as jest.Mocked<typeof axios>;
mockAxios.create = jest.fn(() => mockAxios);
export default mockAxios;
