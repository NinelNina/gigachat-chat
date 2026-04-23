import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Bot, User } from 'lucide-react';
import { Message as MessageType } from '../../types';

interface MessageProps {
    message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === 'user';

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`flex gap-3 sm:gap-4 px-4 py-4 sm:py-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md ${
                isUser
                    ? 'bg-blue-600'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
            }`}>
                {isUser ? (
                    <User size={16} className="text-white" />
                ) : (
                    <Bot size={16} className="text-white" />
                )}
            </div>

            <div className={`flex-1 min-w-0 max-w-[85%] sm:max-w-3xl ${isUser ? 'text-right' : 'text-left'}`}>
        <span className="text-xs font-medium text-[var(--color-text-secondary)] mb-1 block">
          {isUser ? 'Вы' : 'Gemini'}
        </span>

                <div className="relative group inline-block max-w-full">
                    {message.attachments && message.attachments.length > 0 && (
                        <div className={`flex flex-wrap gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                            {message.attachments.map((file, i) => (
                                <div key={i} className="max-w-[200px] overflow-hidden rounded-lg border border-[var(--color-border)] shadow-sm bg-white/5">
                                    {file.mimeType.startsWith('image/') ? (
                                        <img
                                            src={`data:${file.mimeType};base64,${file.data}`}
                                            alt={file.name}
                                            className="max-h-32 w-auto object-contain cursor-zoom-in"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="p-3 text-xs flex items-center gap-2">
                                            <Bot size={14} className="text-blue-500" />
                                            <span className="truncate">{file.name}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className={`
            inline-block text-left px-4 py-3 rounded-2xl shadow-sm
            message-content max-w-full
            ${isUser
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-[var(--color-message-assistant)] text-[var(--color-text)] rounded-tl-sm border border-[var(--color-border)]'
                    }
          `}>
                        <div className={`
              prose prose-sm md:prose-base dark:prose-invert max-w-full break-words overflow-hidden ${isUser ? 'text-white' : 'text-[var(--color-text)]'}
              [&_h1]:!font-normal [&_h2]:!font-normal [&_h3]:!font-normal [&_h4]:!font-normal [&_h5]:!font-normal [&_h6]:!font-normal
              [&_h1]:!text-2xl [&_h2]:!text-xl [&_h3]:!text-lg [&_h4]:!text-base [&_h5]:!text-base [&_h6]:!text-base
              [&_h1]:!mt-6 [&_h2]:!mt-6 [&_h3]:!mt-6 [&_h4]:!mt-6 [&_h5]:!mt-6 [&_h6]:!mt-6
              [&_h1]:!mb-4 [&_h2]:!mb-4 [&_h3]:!mb-4 [&_h4]:!mb-4 [&_h5]:!mb-4 [&_h6]:!mb-4
              [&_h1:first-child]:!mt-0 [&_h2:first-child]:!mt-0 [&_h3:first-child]:!mt-0 [&_h4:first-child]:!mt-0 [&_h5:first-child]:!mt-0 [&_h6:first-child]:!mt-0
              [&_h2]:!border-none [&_h2]:!pb-0
              prose-p:leading-relaxed prose-p:mb-4 prose-p:last-of-type:mb-0
              prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline
              prose-hr:border-[var(--color-border)] prose-hr:my-6 prose-hr:opacity-50
              prose-strong:font-semibold ${isUser ? 'prose-strong:text-white' : 'prose-strong:text-[var(--color-text)]'}
              prose-ul:list-disc prose-ul:pl-5
              prose-ol:list-decimal prose-ol:pl-5
              prose-li:my-1
              prose-table:border-collapse prose-table:w-full prose-table:my-6
              prose-th:border prose-th:border-[var(--color-border)] prose-th:bg-[var(--color-hover)] prose-th:px-4 prose-th:py-2 prose-th:text-left
              prose-td:border prose-td:border-[var(--color-border)] prose-td:px-4 prose-td:py-2
              prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-border)] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[var(--color-text-muted)]
              prose-pre:bg-[#1e1e1e] prose-pre:text-white prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto
              prose-code:bg-[var(--color-hover)] prose-code:text-[var(--color-text)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              ${isUser ? '[&_*]:text-white prose-a:text-blue-200' : ''}
            `}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    code({ node, inline, className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <div className="relative my-2 rounded-lg border border-white/10 max-w-full overflow-hidden bg-[#1e1e1e]">
                                                <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 text-[10px] uppercase font-bold tracking-wider border-b border-white/5 text-gray-400">
                                                    <span>{match[1]}</span>
                                                </div>
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    customStyle={{
                                                        margin: 0,
                                                        padding: '1rem',
                                                        fontSize: '13px',
                                                        lineHeight: '1.5',
                                                        backgroundColor: '#1e1e1e',
                                                        overflowX: 'auto'
                                                    }}
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code className="font-mono" {...props}>
                                                {children}
                                            </code>
                                        );
                                    }
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {!isUser && (
                        <button
                            onClick={handleCopy}
                            className={`absolute top-0 right-0 translate-x-full ml-3
                  opacity-0 group-hover:opacity-100 transition-all p-2
                  bg-[var(--color-input-bg)] hover:bg-[var(--color-hover)]
                  border border-[var(--color-border)] rounded-lg shadow-sm
                  text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]`}
                            title="Копировать"
                        >
                            {copied ? (
                                <Check size={14} className="text-green-500" />
                            ) : (
                                <Copy size={14} />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
