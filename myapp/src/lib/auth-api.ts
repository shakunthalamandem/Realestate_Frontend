import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const authClient = axios.create({
  baseURL: API_URL,
});

type RawRecord = Record<string, unknown>;

type RawTokenBag = {
  access?: string;
  access_token?: string;
  token?: string;
  jwt?: string;
  refresh?: string;
  refresh_token?: string;
  [key: string]: unknown;
};

type RawAuthResponse = {
  access_token?: string;
  token?: string;
  access?: string;
  jwt?: string;
  accessToken?: string;
  auth_token?: string;
  key?: string;
  refresh?: string;
  refresh_token?: string;
  session_id?: string;
  sessionId?: string;
  user?: RawRecord;
  profile?: RawRecord;
  tokens?: RawTokenBag;
  data?: RawAuthResponse;
  result?: RawAuthResponse;
  [key: string]: unknown;
};

export type AuthResult = {
  accessToken: string;
  sessionId?: string | null;
  user?: Record<string, unknown> | null;
};

const asRecord = (value: unknown): RawRecord | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as RawRecord;
};

const unwrapAuthPayload = (payload: RawAuthResponse): RawAuthResponse => {
  const nestedData = asRecord(payload.data);
  if (nestedData) {
    return nestedData as RawAuthResponse;
  }

  const nestedResult = asRecord(payload.result);
  if (nestedResult) {
    return nestedResult as RawAuthResponse;
  }

  return payload;
};

const getString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const firstString = (...candidates: unknown[]): string | undefined => {
  for (const candidate of candidates) {
    const value = getString(candidate);
    if (value) return value;
  }
  return undefined;
};

const parseAuthResponse = (payload: RawAuthResponse): AuthResult => {
  const normalizedPayload = unwrapAuthPayload(payload);
  const tokens = asRecord(normalizedPayload.tokens);
  const user = asRecord(normalizedPayload.user) ?? asRecord(normalizedPayload.profile);

  const accessToken = firstString(
    normalizedPayload.access_token,
    normalizedPayload.token,
    normalizedPayload.access,
    normalizedPayload.jwt,
    normalizedPayload.accessToken,
    normalizedPayload.auth_token,
    normalizedPayload.key,
    tokens?.access,
    tokens?.access_token,
    tokens?.token,
    tokens?.jwt,
  );
  const sessionId =
    firstString(
      normalizedPayload.session_id,
      normalizedPayload.sessionId,
      user?.session_id,
      user?.sessionId,
    ) ?? null;

  if (!accessToken) {
    throw new Error(
      "Auth token was not returned by server. Expected token in response.access_token or response.tokens.access.",
    );
  }

  return { accessToken, sessionId, user };
};

export const signupRequest = async (params: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<AuthResult> => {
  const response = await authClient.post<RawAuthResponse>("/api/auth/signup/", {
    // Backend signup serializer requires both name and username.
    name: params.username,
    username: params.username,
    email: params.email,
    password: params.password,
    reenter_password: params.confirmPassword,
  });

  return parseAuthResponse(response.data);
};

export const loginRequest = async (params: {
  email: string;
  password: string;
}): Promise<AuthResult> => {
  const response = await authClient.post<RawAuthResponse>("/api/auth/login/", {
    // Backend login expects `identifier` (email or username).
    identifier: params.email,
    password: params.password,
  });

  return parseAuthResponse(response.data);
};

export const googleLoginRequest = async (idToken: string): Promise<AuthResult> => {
  const response = await authClient.post<RawAuthResponse>("/api/auth/google/", {
    id_token: idToken,
  });
  return parseAuthResponse(response.data);
};

export const logoutRequest = async (token: string): Promise<void> => {
  await authClient.post(
    "/api/auth/logout/",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const meRequest = async (params: {
  token: string;
  sessionId?: string | null;
}): Promise<Record<string, unknown>> => {
  const response = await authClient.get<Record<string, unknown>>("/api/auth/me/", {
    headers: {
      Authorization: `Bearer ${params.token}`,
      ...(params.sessionId ? { "X-Session-Id": params.sessionId } : {}),
    },
  });

  const payload = asRecord(response.data);
  if (!payload) return {};

  const user = asRecord(payload.user) ?? asRecord(payload.profile);
  return user ?? payload;
};
