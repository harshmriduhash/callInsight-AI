import { useState } from "react";
import { motion } from "framer-motion";
import { Users, MessageSquare, Share2, AtSign, Send } from "lucide-react";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  mentions: string[];
  createdAt: string;
}

interface CollaborationFeaturesProps {
  recordingId: string;
  comments: Comment[];
  onAddComment: (content: string, mentions: string[]) => void;
  onShare: (userId: string, permission: string) => void;
}

export default function CollaborationFeatures({
  recordingId,
  comments,
  onAddComment,
  onShare,
}: CollaborationFeaturesProps) {
  const [newComment, setNewComment] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUserId, setShareUserId] = useState("");
  const [sharePermission, setSharePermission] = useState("view");

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    // Extract mentions (@username)
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(newComment)) !== null) {
      mentions.push(match[1]);
    }

    onAddComment(newComment, mentions);
    setNewComment("");
  };

  return (
    <div className="space-y-6">
      {/* Share Section */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            <h3 className="font-bold">Share Recording</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Share
          </motion.button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5" />
          <h3 className="font-bold">Comments & Feedback</h3>
        </div>

        {/* Comment Input */}
        <div className="mb-4">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment... Use @username to mention someone"
              className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none resize-none"
              rows={3}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {newComment.length}/500
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
                className={`p-2 rounded ${
                  newComment.trim()
                    ? "bg-cyan-500 hover:bg-cyan-600"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Tip: Use @username to mention team members
          </p>
        </div>

        {/* Comments List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-black/20 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{comment.userName}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {comment.content.split(/(@\w+)/g).map((part, i) => {
                  if (part.startsWith("@")) {
                    return (
                      <span key={i} className="text-cyan-400 font-bold">
                        {part}
                      </span>
                    );
                  }
                  return part;
                })}
              </p>
              {comment.mentions.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <AtSign className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    Mentioned: {comment.mentions.join(", ")}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold mb-4">Share Recording</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">User ID or Email</label>
                <input
                  type="text"
                  value={shareUserId}
                  onChange={(e) => setShareUserId(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Permission</label>
                <select
                  value={sharePermission}
                  onChange={(e) => setSharePermission(e.target.value)}
                  className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none"
                >
                  <option value="view">View Only</option>
                  <option value="comment">View & Comment</option>
                  <option value="edit">Full Access</option>
                </select>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onShare(shareUserId, sharePermission);
                    setShowShareModal(false);
                    setShareUserId("");
                  }}
                  className="flex-1 px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Share
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
