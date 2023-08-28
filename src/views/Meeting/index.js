import { Box, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { color } from "../../assets/styles/_color";
import ActionButtons from "../../components/meeting/ActionButtons";
import SariskaMediaTransport from "sariska-media-transport";
import ReconnectDialog from "../../components/shared/ReconnectDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  addRemoteTrack,
  participantLeft,
  removeRemoteTrack,
  remoteTrackMutedChanged,
} from "../../store/actions/track";
import SpeakerLayout from "../../components/meeting/SpeakerLayout";
import Notification from "../../components/shared/Notification";
import {
  SPEAKER,
  GRID,
  ENTER_FULL_SCREEN_MODE
} from "../../constants";
import { isMobileOrTab } from "../../utils";
import PermissionDialog from "../../components/shared/PermissionDialog";
import SnackbarBox from "../../components/shared/Snackbar";
import Home from "../Home";
import {
  setPinParticipant,
  setLayout
} from "../../store/actions/layout";
import { showNotification } from "../../store/actions/notification";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import {
  setCamera,
  setDevices,
  setMicrophone,
} from "../../store/actions/media";

const Meeting = () => {
  const dispatch = useDispatch();
  const localTracks = useSelector((state) => state.localTrack);
  const conference = useSelector((state) => state.conference);
  const connection = useSelector((state) => state.connection);
  const layout = useSelector((state) => state.layout);
  const notification = useSelector((state) => state.notification);
  const snackbar = useSelector((state) => state.snackbar);
  const isOnline = useOnlineStatus();
  const resolution = useSelector((state) => state.media?.resolution);
  const [dominantSpeakerId, setDominantSpeakerId] = useState(null);
  const [lobbyUser, setLobbyUser] = useState([]);
  let oldDevices = useSelector((state) => state?.media?.devices);

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      background: color.secondaryDark,
      minHeight:
        layout.mode === ENTER_FULL_SCREEN_MODE ? "100vh" : "calc(100vh - 16px)",
    },
  }));

  const classes = useStyles();
  let ingoreFirstEvent = true;

  const allowLobbyAccess = (userId) => {
    conference.lobbyApproveAccess(userId);
    setLobbyUser((lobbyUser) => lobbyUser.filter((item) => item.id !== userId));
  };

  const denyLobbyAccess = (userId) => {
    conference.lobbyDenyAccess(userId);
    setLobbyUser((lobbyUser) => lobbyUser.filter((item) => item.id !== userId));
  };

  const deviceListChanged = async (devices) => {
    let selectedDeviceOld,
      audioInputDeviceOld,
      audioOuputDeviceOld,
      videoInputDeviceOld;
    if (oldDevices) {
      selectedDeviceOld = oldDevices.filter(
        (item) => item.deviceId === "default"
      );
      audioInputDeviceOld = selectedDeviceOld.find(
        (item) => item.kind === "audioinput"
      );
      audioOuputDeviceOld = selectedDeviceOld.find(
        (item) => item.kind === "audiooutput"
      );
      videoInputDeviceOld = oldDevices.filter(
        (item) => item.kind === "videoinput"
      );
    }

    const selectedDeviceNew = devices.filter(
      (item) => item.deviceId === "default"
    );
    const audioInputDeviceNew = selectedDeviceNew.find(
      (item) => item.kind === "audioinput"
    );
    const audioOuputDeviceNew = selectedDeviceNew.find(
      (item) => item.kind === "audiooutput"
    );
    const videoInputDeviceNew = selectedDeviceNew.find(
      (item) => item.kind === "videoinput"
    );

    if (
      audioInputDeviceNew?.label &&
      audioInputDeviceOld?.label &&
      audioInputDeviceNew?.label !== audioInputDeviceOld?.label
    ) {
      const audioTrack = localTracks.find(
        (track) => track.getType() === "audio"
      );
      const [newAudioTrack] = await SariskaMediaTransport.createLocalTracks({
        devices: ["audio"],
        micDeviceId: "default",
      });
      dispatch(setMicrophone("default"));
      await conference.replaceTrack(audioTrack, newAudioTrack);
      console.log("audio input update done!!!!");
    }

    if (
      videoInputDeviceNew?.label &&
      videoInputDeviceOld?.label &&
      videoInputDeviceNew?.label !== videoInputDeviceOld?.label
    ) {
      const videoTrack = localTracks.find(
        (track) => track.getType() === "video"
      );
      const [newVideoTrack] = await SariskaMediaTransport.createLocalTracks({
        devices: ["video"],
        cameraDeviceId: "default",
        resolution,
      });
      dispatch(setCamera("default"));
      await conference.replaceTrack(videoTrack, newVideoTrack);
      console.log("video input update done!!!!");
    }

    if (
      audioOuputDeviceNew?.label &&
      audioOuputDeviceOld?.label &&
      audioOuputDeviceNew?.label !== audioOuputDeviceOld?.label
    ) {
      SariskaMediaTransport.mediaDevices.setAudioOutputDevice(
        audioOuputDeviceNew.deviceId
      );
      console.log("audio output update done!!!!");
    }
    dispatch(setDevices(devices));
    oldDevices = devices;
  };

  const audioOutputDeviceChanged = (deviceId) => {
    SariskaMediaTransport.mediaDevices.setAudioOutputDevice(deviceId);
  };

  const destroy = async () => {
    if (conference?.isJoined()) {
      await conference?.leave();
    }
    for (const track of localTracks) {
      await track.dispose();
    }
    await connection?.disconnect();
    SariskaMediaTransport.mediaDevices.removeEventListener(
      SariskaMediaTransport.mediaDevices.DEVICE_LIST_CHANGED,
      deviceListChanged
    );
  };

  useEffect(() => {
    if (!conference) {
      return;
    }

    conference.addEventListener(
      SariskaMediaTransport.events.conference.TRACK_REMOVED,
      (track) => {
        dispatch(removeRemoteTrack(track));
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.TRACK_ADDED,
      (track) => {
        if (track.isLocal()) {
          return;
        }
        dispatch(addRemoteTrack(track));
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.TRACK_MUTE_CHANGED,
      (track) => {
        dispatch(remoteTrackMutedChanged());
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.DOMINANT_SPEAKER_CHANGED,
      (id) => {
        console.log("DOMINANT_SPEAKER_CHANGED", id);
        setDominantSpeakerId(id);
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.LOBBY_USER_JOINED,
      (id, displayName) => {
        new Audio(
          "https://sdk.sariska.io/knock_0b1ea0a45173ae6c10b084bbca23bae2.ogg"
        ).play();
        setLobbyUser((lobbyUser) => [...lobbyUser, { id, displayName }]);
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONNECTION_INTERRUPTED,
      () => {
        dispatch(
          showNotification({
            message:
              "You lost your internet connection. Trying to reconnect...",
            severity: "info",
          })
        );
        ingoreFirstEvent = false;
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.ENDPOINT_MESSAGE_RECEIVED,
      async (participant, data) => {
        if (
          data.event === "LOBBY-ACCESS-GRANTED" ||
          data.event === "LOBBY-ACCESS-DENIED"
        ) {
          setLobbyUser((lobbyUser) =>
            lobbyUser.filter((item) => item.displayName !== data.name)
          );
        }
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONNECTION_RESTORED,
      () => {
        if (ingoreFirstEvent) {
          return;
        }
        dispatch(
          showNotification({
            message: "Your Internet connection was restored",
            autoHide: true,
            severity: "info",
          })
        );
      }
    );

    SariskaMediaTransport.effects.createRnnoiseProcessor();
    SariskaMediaTransport.mediaDevices.addEventListener(
      SariskaMediaTransport.events.mediaDevices.DEVICE_LIST_CHANGED,
      deviceListChanged
    );
    SariskaMediaTransport.mediaDevices.addEventListener(
      SariskaMediaTransport.events.mediaDevices.AUDIO_OUTPUT_DEVICE_CHANGED,
      audioOutputDeviceChanged
    );

    window.addEventListener("beforeunload", destroy);

    return () => {
      destroy();
    };
  }, [conference]);

  useEffect(() => {
    if (!conference) {
      return;
    }
    const userLeft = (id) => {
      if (id === dominantSpeakerId) {
        setDominantSpeakerId(null);
      }
      if (id === layout.pinnedParticipant.participantId) {
        dispatch(setPinParticipant(null));
      }

      dispatch(participantLeft(id));
    };
    conference.addEventListener(
      SariskaMediaTransport.events.conference.USER_LEFT,
      userLeft
    );
    return () => {
      conference.removeEventListener(
        SariskaMediaTransport.events.conference.USER_LEFT,
        userLeft
      );
    };
  }, [conference, layout]);

  useEffect(() => {
    SariskaMediaTransport.setNetworkInfo({ isOnline });
  }, [isOnline]);

  useEffect(()=> {
    if(isMobileOrTab()) {
      if(layout.type === SPEAKER)
      dispatch(setLayout(GRID));
    }
  },[])
  
  if (!conference || !conference.isJoined()) {
    return <Home />;
  }
  let justifyContent = "space-between";
  let paddingTop = 16;
  if (layout.mode === ENTER_FULL_SCREEN_MODE) {
    justifyContent = "space-around";
    paddingTop = 0;
  }
  
  return (
    <Box
      style={{ justifyContent, paddingTop: paddingTop }}
      className={classes.root}
    >
      {layout.type === SPEAKER && (
        <SpeakerLayout dominantSpeakerId={dominantSpeakerId} />
      )}
      {/* {layout.type === GRID && (
        <GridLayout dominantSpeakerId={dominantSpeakerId} />
      )} */}
      
      {/* {layout.type === PRESENTATION && (
        <PresentationLayout dominantSpeakerId={dominantSpeakerId} />
      )} */}
      
      <ActionButtons dominantSpeakerId={dominantSpeakerId} />
      {lobbyUser.map((item) => (
        <PermissionDialog
          denyLobbyAccess={denyLobbyAccess}
          allowLobbyAccess={allowLobbyAccess}
          userId={item.id}
          displayName={item.displayName}
        />
      ))}
      <SnackbarBox notification={notification} />
      <ReconnectDialog open={layout.disconnected === "lost"} />
      <Notification snackbar={snackbar} />
    </Box>
  );
};

export default Meeting;
