import {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} from "agora-access-token";
const appId = "b79fdafba2a84c2a9e28e9b250ff90df";
const appCertificate = "20ce945d635643fabc5a2be06f84d065";
const channelName = "Alem";
const uid = 0;
const userAccount = "User account";
const role = RtcRole.PUBLISHER;
const expirationTimeInSeconds = 24 * 60 * 60;
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
// Build token with uid

export default function handler(req, res) {
  if (req.method == "POST") {
    const { channel, uid } = JSON.parse(req.body);
    const tokenA = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channel,
      uid,
      role,
      privilegeExpiredTs
    );
    res.status(200).json({ token: tokenA });
  }
}


