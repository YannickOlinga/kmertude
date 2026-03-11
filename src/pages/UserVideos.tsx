import './YouTubeStyle.css'
import UserNavbar from '../components/UserNavbar'

export default function UserVideos() {
  const videos = [
    {
      id: 1,
      title: "Rechercher des offres de cours",
      channelName: "Kmertude Formation", 
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
      duration: "3:49",
      videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face"
    },
    {
      id: 2,
      title: "1er contact avec la famille : on en parle ?",
      channelName: "Kmertude Formation",  
      thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=225&fit=crop",
      duration: "3:31",
      videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face"
    },
    {
      id: 3,
      title: "Réussir le 1er cours : on en parle ?",
      channelName: "Kmertude Formation", 
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
      duration: "4:14",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face"
    },
    {
      id: 4,
      title: "Déclarer ses heures de cours",
      channelName: "Kmertude Formation", 
      thumbnail: "https://images.unsplash.com/photo-1554224154-260325c05f6b?w=400&h=225&fit=crop",
      duration: "2:10",
      videoUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
      channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face"
    },
    {
      id: 5,
      title: "Communiquer efficacement avec tout le monde",
      channelName: "Kmertude Formation",
      thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=225&fit=crop",
      duration: "4:43",
      videoUrl: "https://www.youtube.com/watch?v=C9LW7tK8yVQ",
      channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face"
    },
    {
      id: 6,
      title: "Gérer son temps efficacement",
      channelName: "Kmertude Formation",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
      duration: "5:22",
      videoUrl: "https://www.youtube.com/watch?v=VOTzqfN-2t8",
      channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face"
    },
    {
      id: 7,
      title: "Préparer ses séances de cours",
      channelName: "Kmertude Formation",
      thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop",
      duration: "3:58",
      videoUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
      channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face"
    },
    {
      id: 8,
      title: "Fixer ses tarifs de cours",
      channelName: "Kmertude Formation",
      thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop",
      duration: "4:05",
      videoUrl: "https://www.youtube.com/watch?v=2LqzF5WauAw",
      channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face"
    }
  ]

  return (
    <div>

      {/* Main Content Area */}
      <UserNavbar></UserNavbar>
      <div className="youtube-main align-center">
      
        <main className="youtube-content">
          <div className="video-grid">
            {videos.map((video) => (
              <a 
                key={video.id}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="video-card"
              >
                {/* Video Thumbnail */}
                <div className="video-thumbnail-container">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="video-thumbnail"
                  />
                  <div className="video-duration">{video.duration}</div>
                </div>
                
                {/* Video Info */}
                <div className="video-info">
                  <img 
                    src={video.channelAvatar} 
                    alt={video.channelName}
                    className="channel-avatar"
                  />
                  <div className="video-details">
                    <h3 className="video-title">{video.title}</h3>
                    <div className="video-metadata">
                      <div className="channel-name">{video.channelName}</div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
