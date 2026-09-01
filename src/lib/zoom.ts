type CreateMeetingInput = {
  topic: string;
  startTime: Date;
  durationMin: number;
  agenda?: string;
};

export type ZoomMeetingResult = {
  joinUrl: string;
  meetingId: string;
  passcode: string;
  mode: "live" | "local";
};

function hasZoomCredentials() {
  return Boolean(
    process.env.ZOOM_ACCOUNT_ID &&
      process.env.ZOOM_CLIENT_ID &&
      process.env.ZOOM_CLIENT_SECRET,
  );
}

async function getZoomAccessToken() {
  const accountId = process.env.ZOOM_ACCOUNT_ID!;
  const clientId = process.env.ZOOM_CLIENT_ID!;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET!;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Unable to authenticate with Zoom.");
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function createZoomMeeting(
  input: CreateMeetingInput,
): Promise<ZoomMeetingResult> {
  if (!hasZoomCredentials()) {
    const meetingId = `LOCAL-${Date.now().toString().slice(-8)}`;
    return {
      joinUrl: `https://zoom.us/j/${meetingId}`,
      meetingId,
      passcode: "shaw-meet",
      mode: "local",
    };
  }

  const token = await getZoomAccessToken();
  const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: input.topic,
      type: 2,
      start_time: input.startTime.toISOString(),
      duration: input.durationMin,
      agenda: input.agenda,
      settings: {
        join_before_host: false,
        waiting_room: true,
        meeting_authentication: false,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Zoom meeting creation failed.");
  }

  const data = (await response.json()) as {
    id: number | string;
    join_url: string;
    password?: string;
  };

  return {
    joinUrl: data.join_url,
    meetingId: String(data.id),
    passcode: data.password ?? "",
    mode: "live",
  };
}
