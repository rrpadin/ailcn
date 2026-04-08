import React from 'react';
import { FileVideo, FileAudio, AlertCircle } from 'lucide-react';

const MediaPreview = ({ url, type }) => {
  if (!url) return null;

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVimeoId = (url) => {
    const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  if (type === 'video') {
    const ytId = getYoutubeId(url);
    const vimeoId = getVimeoId(url);

    if (ytId) {
      return (
        <div className="aspect-video w-full rounded-md overflow-hidden border bg-muted">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${ytId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    if (vimeoId) {
      return (
        <div className="aspect-video w-full rounded-md overflow-hidden border bg-muted">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    // Generic video or invalid URL
    return (
      <div className="aspect-video w-full rounded-md border bg-muted flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
        {url.endsWith('.mp4') || url.endsWith('.webm') ? (
          <video src={url} controls className="w-full h-full object-contain" />
        ) : (
          <>
            <FileVideo className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">Video URL provided</p>
            <p className="text-xs opacity-70 truncate max-w-full mt-1">{url}</p>
            <p className="text-xs text-amber-500 mt-2 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> Preview not available for this format
            </p>
          </>
        )}
      </div>
    );
  }

  if (type === 'audio') {
    return (
      <div className="w-full rounded-md border bg-muted p-4 flex flex-col items-center justify-center">
        <FileAudio className="w-8 h-8 mb-3 text-muted-foreground opacity-50" />
        <audio controls className="w-full max-w-md">
          <source src={url} />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return null;
};

export default MediaPreview;