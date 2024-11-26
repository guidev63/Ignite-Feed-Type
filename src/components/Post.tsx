import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importação correta
import styles from './Post.module.css';
import { Comment } from './Comment';
import { Avatar } from './Avatar';
import { FormEvent, useState, ChangeEvent, InvalidEvent } from 'react';

// Definição das interfaces
interface Author {
  name: string;
  role: string;
  avatarUrl: string;
}

interface Content {
  type: 'paragraph' | 'link';
  content: string;
}

interface PostProps {
  author: Author;
  publishedAt: Date;
  content: Content[];
}

export function Post({ author, publishedAt, content }: PostProps) {
  const [comments, setComments] = useState(['Post muito bacana, hein?!']);
  const [newCommentText, setNewCommentText] = useState('');

  // Formatação de datas
  const publishedDateFormatted = format(
    publishedAt,
    "d 'de' LLLL 'às' HH:mm'h'",
    { locale: ptBR }
  );

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  // Função para criar novos comentários
  function handleCreateNewComment(event: FormEvent) {
    event.preventDefault();
    setComments((prevComments) => [...prevComments, newCommentText]);
    setNewCommentText('');
  }

  // Função para deletar comentários
  function deleteComment(commentToDelete: string) {
    const commentsWithoutDeletedOne = comments.filter(
      (comment) => comment !== commentToDelete
    );
    setComments(commentsWithoutDeletedOne);
  }

  // Atualização do texto do comentário
  function handleCreateNewCommentChange(
    event: ChangeEvent<HTMLTextAreaElement>
  ) {
    event.target.setCustomValidity('');
    setNewCommentText(event.target.value);
  }

  // Mensagem personalizada para campo inválido
  function handleCreateNewCommentInvalid(
    event: InvalidEvent<HTMLTextAreaElement>
  ) {
    event.target.setCustomValidity('Esse campo é obrigatório!');
  }

  const isNewCommentEmpty = newCommentText.trim().length === 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar hasBorder={true} src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>
        <time
          title={publishedDateFormatted}
          dateTime={publishedAt.toISOString()}
        >
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>
        {content.map((line, index) => {
          if (line.type === 'paragraph') {
            return <p key={`content-${index}`}>{line.content}</p>;
          } else if (line.type === 'link') {
            return (
              <p key={`content-${index}`}>
                <a href="#">{line.content}</a>
              </p>
            );
          }
          return null;
        })}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>
        <textarea
          name="comment"
          placeholder="Deixe um comentário"
          value={newCommentText}
          onChange={handleCreateNewCommentChange}
          onInvalid={handleCreateNewCommentInvalid}
          required
        />
        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>
            Publicar
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <Comment
            key={comment}
            content={comment}
            onDeleteComment={deleteComment}
          />
        ))}
      </div>
    </article>
  );
}
