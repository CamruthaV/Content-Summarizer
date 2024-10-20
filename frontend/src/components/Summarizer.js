import React, { useState, useEffect } from 'react';
import { BsStars } from "react-icons/bs";
import './Summarizer.css';
import { FaUserAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Summarizer = () => {
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');
    const [maxLength, setMaxLength] = useState(200);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showContent, setShowContent] = useState(true);
    const [displayedSummary, setDisplayedSummary] = useState('');

    const handleSummarizeText = async () => {
        setError('');
        setSummary('');
        setLoading(true);
        setShowContent(false); 
        try {
            const response = await fetch('http://localhost:5001/api/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, maxLength }),
            });

            if (!response.ok) {
                throw new Error('Failed to summarize text');
            }

            const data = await response.json();
            setSummary(data.summary);
        } catch (error) {
            setError('Failed to summarize text');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSummarizeUrl = async () => {
        setError('');
        setSummary('');
        setLoading(true);
        setShowContent(false);

        try {
            const response = await fetch(`http://localhost:5001/api/summarize-url?url=${encodeURIComponent(url)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to summarize URL');
            }

            const data = await response.json();
            setSummary(data.summary || 'No summary available.');
        } catch (error) {
            setError('Failed to summarize URL');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (summary) {
            typeWriterEffect(summary);
        }
    }, [summary]);

    const typeWriterEffect = (text) => {
        let index = 0;
        setDisplayedSummary('');

        const type = () => {
            if (index < text.length) {
                setDisplayedSummary((prev) => prev + text.charAt(index));
                index++;
                setTimeout(type, 50);
            }
        };

        type();
    };

    return (
        <div className="summarizer">
            <nav className="navbar">
                <div className="logo"><h2>::AIConcise</h2></div>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">API</Link></li>
                    <li><Link to="/team">Team</Link></li>
                    <li><FaUserAlt /></li>
                </ul>
            </nav>

            <div className="summarizer-container">
                {showContent && (
                    <div className="text-content">
                        <h1 className="summarizer-title">Transform Your Text with our AI-Powered Tool using</h1>
                        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h1>Gemini API</h1>
                            <BsStars className="stars-icon" />
                        </div>

                        <textarea
                            className="summarizer-text-area"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows="10"
                            cols="50"
                            placeholder="Enter text to summarize"
                        />

                        <div className="button-container"> 
                            <button className="summarizer-button" onClick={handleSummarizeText} disabled={loading}>
                                {loading ? <div className="loader"></div> : 'Summarize Text'}
                            </button>

                            <input
                                type="text"
                                className="summarizer-url-input"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Enter article URL to summarize"
                            />
                            <button className="summarizer-button" onClick={handleSummarizeUrl} disabled={loading}>
                                {loading ? <div className="loader"></div> : 'Summarize URL'}
                            </button>
                        </div>

                        {error && <p className="summarizer-error-text">{error}</p>}
                    </div>
                )}

                {!showContent && loading && (
                    <div className="loader-container">
                        <div className="loader"></div>
                        <p className="loading-text">Your summary is being generated...</p>
                    </div>
                )}

                {!showContent && !loading && displayedSummary && (
                    <div className="summary-container">
                        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h1>Here is your Summary</h1>
                            <BsStars className="stars-icon" />
                        </div>
                        <div className="summarizer-summary-box">
                            <p className="summarizer-summary-text">{displayedSummary}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Summarizer;
