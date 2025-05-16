'use client'
import React, { useState, useEffect } from 'react'
import './comments.css'
import { FaUser, FaReply, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa'
import { useSession } from 'next-auth/react'

const CommentsSection = ({ articleId, comments = [], language = 'en' }) => {
  const { data: session } = useSession()
  const [commentList, setCommentList] = useState(comments)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [userVotes, setUserVotes] = useState({})

  useEffect(() => {
    // تحميل تصويتات المستخدم من localStorage
    const savedVotes = localStorage.getItem(`commentVotes_${articleId}`)
    if (savedVotes) {
      setUserVotes(JSON.parse(savedVotes))
    }
  }, [articleId])

  const handleVote = (commentId, voteType) => {
    const newVotes = { ...userVotes, [commentId]: voteType }
    setUserVotes(newVotes)
    localStorage.setItem(`commentVotes_${articleId}`, JSON.stringify(newVotes))
    
    // تحديث حالة التصويت في قائمة التعليقات
    setCommentList(prev => prev.map(comment => {
      if (comment._id === commentId) {
        return {
          ...comment,
          upvotes: voteType === 'up' ? comment.upvotes + 1 : comment.upvotes,
          downvotes: voteType === 'down' ? comment.downvotes + 1 : comment.downvotes
        }
      }
      return comment
    }))
  }

  const sortedComments = [...commentList].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
    }
  })

  const submitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    setIsSubmitting(true)
    const tempId = `temp-${Date.now()}`
    
    try {
      // إنشاء تعليق مؤقت أثناء الإرسال
      const tempComment = {
        _id: tempId,
        name: session?.user?.name || 'Anonymous',
        email: session?.user?.email || '',
        text: newComment,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        isPending: true,
        replies: []
      }
      
      setCommentList([tempComment, ...commentList])
      setNewComment('')
      
      // هنا سيتم استدعاء API لإضافة التعليق
      // const response = await addCommentAPI(articleId, newComment)
      
      // بعد نجاح الإرسال، استبدال التعليق المؤقت بالحقيقي
      // setCommentList(prev => [
      //   response.data,
      //   ...prev.filter(c => c._id !== tempId)
      // ])
      
      // لمثالنا سنقوم فقط بإزالة حالة Pending بعد 2 ثانية
      setTimeout(() => {
        setCommentList(prev => prev.map(c => 
          c._id === tempId ? { ...c, isPending: false } : c
        ))
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting comment:', error)
      setCommentList(prev => prev.filter(c => c._id !== tempId))
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitReply = async (parentId, e) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    
    setIsSubmitting(true)
    const tempId = `temp-reply-${Date.now()}`
    
    try {
      // إنشاء رد مؤقت أثناء الإرسال
      const tempReply = {
        _id: tempId,
        name: session?.user?.name || 'Anonymous',
        email: session?.user?.email || '',
        text: replyContent,
        createdAt: new Date().toISOString(),
        isPending: true
      }
      
      setCommentList(prev => prev.map(comment => {
        if (comment._id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), tempReply]
          }
        }
        return comment
      }))
      
      setReplyContent('')
      setReplyingTo(null)
      
      // هنا سيتم استدعاء API لإضافة الرد
      // await addReplyAPI(articleId, parentId, replyContent)
      
      // لمثالنا سنقوم فقط بإزالة حالة Pending بعد 2 ثانية
      setTimeout(() => {
        setCommentList(prev => prev.map(comment => {
          if (comment._id === parentId) {
            return {
              ...comment,
              replies: comment.replies.map(r => 
                r._id === tempId ? { ...r, isPending: false } : r
              )
            }
          }
          return comment
        }))
      }, 2000)
      
    } catch (error) {
      console.error('Error submitting reply:', error)
      setCommentList(prev => prev.map(comment => {
        if (comment._id === parentId) {
          return {
            ...comment,
            replies: comment.replies.filter(r => r._id !== tempId)
          }
        }
        return comment
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderComment = (comment, depth = 0) => (
    <div 
      key={comment._id} 
      className={`comment ${depth > 0 ? 'reply' : ''}`}
      style={{ marginLeft: `${depth * 30}px` }}
    >
      <div className="comment-header">
        <div className="comment-author">
          <div className="avatar">
            {comment.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4>{comment.name}</h4>
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
            {comment.isPending && (
              <span className="pending-badge">
                <FaSpinner className="spinner" /> Pending
              </span>
            )}
          </div>
        </div>
        
        <div className="comment-votes">
          <button 
            onClick={() => handleVote(comment._id, 'up')}
            disabled={userVotes[comment._id] === 'up'}
            className={userVotes[comment._id] === 'up' ? 'active' : ''}
          >
            <FaCheck /> {comment.upvotes || 0}
          </button>
          <button 
            onClick={() => handleVote(comment._id, 'down')}
            disabled={userVotes[comment._id] === 'down'}
            className={userVotes[comment._id] === 'down' ? 'active' : ''}
          >
            <FaTimes /> {comment.downvotes || 0}
          </button>
        </div>
      </div>
      
      <div className="comment-body">
        <p>{comment.text}</p>
      </div>
      
      <div className="comment-actions">
        {depth < 2 && (
          <button 
            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
            className="reply-button"
          >
            <FaReply /> Reply
          </button>
        )}
      </div>
      
      {replyingTo === comment._id && (
        <form onSubmit={(e) => submitReply(comment._id, e)} className="reply-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            rows="3"
            required
          />
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setReplyingTo(null)}
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </form>
      )}
      
      {comment.replies?.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  )

  return (
    <section className="comments-section">
      <div className="comments-header">
        <h2>Comments ({commentList.length})</h2>
        <div className="sort-options">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="top">Top Rated</option>
          </select>
        </div>
      </div>
      
      {session ? (
        <form onSubmit={submitComment} className="comment-form">
          <div className="form-group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows="4"
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <FaSpinner className="spinner" /> : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="login-prompt">
          <p>Please sign in to leave a comment.</p>
          <button onClick={() => signIn()}>Sign In</button>
        </div>
      )}
      
      <div className="comments-list">
        {sortedComments.length > 0 ? (
          sortedComments.map(comment => renderComment(comment))
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </section>
  )
}

export default CommentsSection