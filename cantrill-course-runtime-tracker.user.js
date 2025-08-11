// ==UserScript==
// @name         Cantrill.io Course Runtime & Progress Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Embed course runtime and remaining time in sidebar, visually consistent with existing design
// @author       Neil Bryan
// @match        https://learn.cantrill.io/p/*
// @match        https://learn.cantrill.io/courses/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function parseTimeToSeconds(timeString) {
        if (!timeString) return 0;
        
        // Remove parentheses, brackets, and trim
        timeString = timeString.replace(/[()[\]]/g, '').trim();
        
        // Format: HH:MM:SS or MM:SS
        const colonMatch = timeString.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
        if (colonMatch) {
            const hours = colonMatch[3] ? parseInt(colonMatch[1]) || 0 : 0;
            const minutes = colonMatch[3] ? parseInt(colonMatch[2]) || 0 : parseInt(colonMatch[1]) || 0;
            const seconds = colonMatch[3] ? parseInt(colonMatch[3]) || 0 : parseInt(colonMatch[2]) || 0;
            return hours * 3600 + minutes * 60 + seconds;
        }
        
        // Format: 1h 30m 45s or variations
        const hmsMatch = timeString.match(/(?:(\d+)h)?(?:\s*(\d+)m)?(?:\s*(\d+)s)?/);
        if (hmsMatch && (hmsMatch[1] || hmsMatch[2] || hmsMatch[3])) {
            const hours = parseInt(hmsMatch[1]) || 0;
            const minutes = parseInt(hmsMatch[2]) || 0;
            const seconds = parseInt(hmsMatch[3]) || 0;
            return hours * 3600 + minutes * 60 + seconds;
        }
        
        // Format: "90 min" or "45 minutes"
        const minMatch = timeString.match(/(\d+)\s*(?:min|minutes?)/i);
        if (minMatch) {
            return parseInt(minMatch[1]) * 60;
        }
        
        return 0;
    }

    function formatSecondsToTime(totalSeconds, compact = false) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (compact) {
            if (hours > 0) {
                return `${hours}h ${minutes}m`;
            } else {
                return `${minutes}m`;
            }
        } else {
            if (hours > 0) {
                return `${hours}h ${minutes}m ${seconds}s`;
            } else if (minutes > 0) {
                return `${minutes}m ${seconds}s`;
            } else {
                return `${seconds}s`;
            }
        }
    }

    function getCompletionPercentage() {
        // Look for the percentage in the progress section
        const percentageElement = document.querySelector('.course-progress-percentage .percentage');
        if (percentageElement) {
            const percentText = percentageElement.textContent.trim().replace('%', '');
            const percent = parseInt(percentText);
            return isNaN(percent) ? 0 : percent;
        }
        
        // Fallback: look for progress bar fill
        const progressFill = document.querySelector('.progressbar-fill');
        if (progressFill) {
            const style = progressFill.getAttribute('style');
            const widthMatch = style.match(/min-width:\s*(\d+)%/);
            if (widthMatch) {
                return parseInt(widthMatch[1]);
            }
        }
        
        return 0;
    }

    function calculateTotalRuntime() {
        let totalSeconds = 0;
        let videoCount = 0;
        let videosWithTime = 0;
        const videoDetails = [];
        
        console.log('🔍 Starting runtime calculation...');
        
        // Look for lecture items in the course curriculum
        const lectureItems = document.querySelectorAll('.section-item a.item');
        console.log(`Found ${lectureItems.length} lecture items`);
        
        lectureItems.forEach((item, index) => {
            const lectureNameElement = item.querySelector('.lecture-name');
            if (!lectureNameElement) {
                console.log(`No lecture name found for item ${index}`);
                return;
            }
            
            // Get the full text content including whitespace and newlines
            const fullText = lectureNameElement.textContent;
            const cleanText = fullText.replace(/\s+/g, ' ').trim(); // Normalize whitespace
            videoCount++;
            
            // More flexible regex patterns to handle various formats with whitespace
            const timePatterns = [
                // Standard parentheses with potential whitespace: (6:28)
                /\(\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*\)/,
                // Brackets: [6:28]
                /\[\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*\]/,
                // Just the time pattern at the end with whitespace
                /\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*$/,
                // Time pattern anywhere in the text
                /(\d{1,2}:\d{2}(?::\d{2})?)/
            ];
            
            let timeMatch = null;
            let timeString = '';
            
            // Try each pattern
            for (const pattern of timePatterns) {
                timeMatch = cleanText.match(pattern);
                if (timeMatch) {
                    timeString = timeMatch[1];
                    break;
                }
            }
            
            // Also check the original full text for patterns
            if (!timeMatch) {
                for (const pattern of timePatterns) {
                    timeMatch = fullText.match(pattern);
                    if (timeMatch) {
                        timeString = timeMatch[1];
                        break;
                    }
                }
            }
            
            if (timeMatch && timeString) {
                const seconds = parseTimeToSeconds(timeString);
                if (seconds > 0) {
                    totalSeconds += seconds;
                    videosWithTime++;
                    
                    const videoInfo = {
                        title: cleanText.replace(timeMatch[0], '').trim(),
                        duration: timeString,
                        seconds: seconds
                    };
                    videoDetails.push(videoInfo);
                    console.log(`✅ Video ${videosWithTime}: "${videoInfo.title}" - ${timeString} (${seconds}s)`);
                } else {
                    console.log(`⚠️ Could not parse time: ${timeString}`);
                }
            } else {
                // Show a sample of the text for debugging
                const sampleText = cleanText.length > 50 ? cleanText.substring(0, 50) + '...' : cleanText;
                console.log(`ℹ️ No duration found: "${sampleText}"`);
            }
        });
        
        console.log(`📊 Total: ${totalSeconds}s from ${videosWithTime}/${videoCount} videos`);
        
        return {
            totalSeconds,
            videoCount,
            videosWithTime,
            formattedTime: formatSecondsToTime(totalSeconds),
            compactTime: formatSecondsToTime(totalSeconds, true),
            videoDetails
        };
    }

    function createRuntimeDisplay(runtimeData, completionPercent) {
        // Calculate remaining time
        const remainingPercent = Math.max(0, 100 - completionPercent);
        const remainingSeconds = Math.round((runtimeData.totalSeconds * remainingPercent) / 100);
        const remainingTime = formatSecondsToTime(remainingSeconds, true);
        
        // Calculate coverage percentage
        const coveragePercent = Math.round((runtimeData.videosWithTime / runtimeData.videoCount) * 100);
        
        // Create the runtime display element
        const runtimeDisplay = document.createElement('div');
        runtimeDisplay.id = 'course-runtime-display';
        runtimeDisplay.className = 'course-progress'; // Use same class as existing progress
        
        runtimeDisplay.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 15px;
                margin: 15px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                position: relative;
            ">
                <!-- Refresh Button -->
                <button id="runtime-refresh-btn" style="
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    z-index: 1001;
                " title="Recalculate runtime">🔄</button>
                
                <div style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    font-weight: 600;
                    color: #495057;
                    font-size: 14px;
                    padding-right: 30px;
                ">
                    <svg width="16" height="16" style="margin-right: 8px; fill: #6c757d;">
                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
                        <path d="M8 4c-0.6 0-1 0.4-1 1v3c0 0.6 0.4 1 1 1s1-0.4 1-1V5c0-0.6-0.4-1-1-1z"/>
                        <circle cx="8" cy="10" r="1"/>
                    </svg>
                    VIDEO RUNTIME
                </div>
                
                <!-- Main Stats -->
                <div style="margin-bottom: 15px;">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 8px;
                    ">
                        <span style="color: #6c757d; font-size: 13px;">Total Video Time:</span>
                        <span style="font-weight: 600; color: #495057; font-size: 15px;">${runtimeData.compactTime}</span>
                    </div>
                    
                    ${completionPercent > 0 ? `
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 8px;
                    ">
                        <span style="color: #6c757d; font-size: 13px;">Time Remaining:</span>
                        <span style="font-weight: 600; color: #dc3545; font-size: 15px;">${remainingTime}</span>
                    </div>
                    ` : ''}
                </div>
                
                ${completionPercent > 0 ? `
                <div style="
                    background: #f8f9fa;
                    border-radius: 4px;
                    padding: 10px;
                    border-left: 3px solid #28a745;
                    margin-bottom: 15px;
                ">
                    <div style="font-size: 12px; color: #6c757d; margin-bottom: 3px;">
                        Course Progress: ${completionPercent}% complete
                    </div>
                    <div style="font-size: 11px; color: #28a745; font-weight: 500;">
                        ${remainingPercent}% remaining ≈ ${remainingTime} of video content
                    </div>
                </div>
                ` : ''}
                
                <!-- Collapsible Details Section -->
                <div style="border-top: 1px solid #dee2e6; padding-top: 10px;">
                    <button id="toggle-details" style="
                        background: none;
                        border: none;
                        color: #6c757d;
                        font-size: 11px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        padding: 5px;
                        transition: color 0.2s ease;
                    " title="Show/hide calculation details">
                        <span id="toggle-icon" style="margin-right: 5px; transition: transform 0.2s ease;">▼</span>
                        <span>Calculation Details</span>
                    </button>
                    
                    <div id="details-content" style="
                        display: none;
                        margin-top: 10px;
                        padding: 10px;
                        background: rgba(108, 117, 125, 0.05);
                        border-radius: 4px;
                        font-size: 11px;
                        color: #6c757d;
                    ">
                        <div style="margin-bottom: 6px;">
                            <strong>Video Lessons:</strong> ${runtimeData.videosWithTime} with duration info
                        </div>
                        <div style="margin-bottom: 6px;">
                            <strong>Other Content:</strong> ${runtimeData.videoCount - runtimeData.videosWithTime} items (quizzes, resources, etc.)
                        </div>
                        <div style="margin-bottom: 6px;">
                            <strong>Coverage:</strong> ${coveragePercent}% of course items have video duration
                        </div>
                        <div style="margin-bottom: 6px;">
                            <strong>Total Seconds:</strong> ${runtimeData.totalSeconds.toLocaleString()}
                        </div>
                        <div style="font-size: 10px; color: #868e96; margin-top: 8px; font-style: italic;">
                            * Time remaining is estimated based on video content only
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return runtimeDisplay;
    }

    function embedRuntimeDisplay() {
        console.log('🚀 Embedding runtime display...');
        
        // Remove existing display if present
        const existing = document.getElementById('course-runtime-display');
        if (existing) {
            console.log('Removing existing runtime display');
            existing.remove();
        }
        
        // Find the course progress section in the sidebar
        const courseProgress = document.querySelector('.course-progress');
        if (!courseProgress) {
            console.log('❌ Course progress section not found');
            return null;
        }
        
        // Calculate runtime data
        const runtimeData = calculateTotalRuntime();
        if (runtimeData.videosWithTime === 0) {
            console.log('❌ No videos with duration found');
            return null;
        }
        
        // Get completion percentage
        const completionPercent = getCompletionPercentage();
        console.log(`📈 Completion: ${completionPercent}%`);
        
        // Create and insert the runtime display
        const runtimeDisplay = createRuntimeDisplay(runtimeData, completionPercent);
        
        // Insert after the existing course progress
        courseProgress.parentNode.insertBefore(runtimeDisplay, courseProgress.nextSibling);
        
        // Add event listeners
        const refreshBtn = runtimeDisplay.querySelector('#runtime-refresh-btn');
        const toggleBtn = runtimeDisplay.querySelector('#toggle-details');
        const toggleIcon = runtimeDisplay.querySelector('#toggle-icon');
        const detailsContent = runtimeDisplay.querySelector('#details-content');
        
        // Refresh button functionality
        if (refreshBtn) {
            refreshBtn.addEventListener('mouseenter', () => {
                refreshBtn.style.background = '#5a6268';
                refreshBtn.style.transform = 'scale(1.1)';
            });
            
            refreshBtn.addEventListener('mouseleave', () => {
                refreshBtn.style.background = '#6c757d';
                refreshBtn.style.transform = 'scale(1)';
            });
            
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔄 Refresh button clicked!');
                
                refreshBtn.innerHTML = '⏳';
                refreshBtn.style.background = '#ffc107';
                
                setTimeout(() => {
                    const newData = embedRuntimeDisplay();
                    if (newData) {
                        console.log('✅ Runtime display refreshed successfully');
                    }
                }, 500);
            });
        }
        
        // Toggle details functionality
        if (toggleBtn && toggleIcon && detailsContent) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isVisible = detailsContent.style.display !== 'none';
                
                if (isVisible) {
                    detailsContent.style.display = 'none';
                    toggleIcon.style.transform = 'rotate(0deg)';
                    toggleIcon.textContent = '▼';
                } else {
                    detailsContent.style.display = 'block';
                    toggleIcon.style.transform = 'rotate(180deg)';
                    toggleIcon.textContent = '▲';
                }
            });
            
            toggleBtn.addEventListener('mouseenter', () => {
                toggleBtn.style.color = '#495057';
            });
            
            toggleBtn.addEventListener('mouseleave', () => {
                toggleBtn.style.color = '#6c757d';
            });
        }
        
        // Log to console
        console.log(`%c📊 Course Runtime Analysis`, 'background: #2c3e50; color: #3498db; padding: 8px; border-radius: 4px; font-weight: bold;');
        console.log(`Total Runtime: ${runtimeData.formattedTime}`);
        console.log(`Progress: ${completionPercent}% complete`);
        if (completionPercent > 0) {
            const remainingPercent = 100 - completionPercent;
            const remainingSeconds = Math.round((runtimeData.totalSeconds * remainingPercent) / 100);
            console.log(`Remaining: ${formatSecondsToTime(remainingSeconds)} (${remainingPercent}%)`);
        }
        console.log(`Videos: ${runtimeData.videosWithTime}/${runtimeData.videoCount} with duration`);
        
        return runtimeData;
    }

    // Initialize the script
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Wait for content to load
        setTimeout(() => {
            console.log('🎯 Cantrill.io Course Runtime & Progress Tracker loaded');
            
            // Check if we're on a course page with curriculum
            const courseProgress = document.querySelector('.course-progress');
            const lectureItems = document.querySelectorAll('.section-item');
            
            if (courseProgress && lectureItems.length > 0) {
                console.log(`Found course progress section and ${lectureItems.length} lecture items`);
                embedRuntimeDisplay();
            } else {
                console.log('❌ Not on a course curriculum page or no lectures found');
                console.log(`Course progress found: ${!!courseProgress}`);
                console.log(`Lecture items found: ${lectureItems.length}`);
            }
        }, 2000);
    }

    // Handle single-page app navigation
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            console.log('🔄 URL changed, reinitializing...');
            setTimeout(init, 1500); // Re-initialize on navigation
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    init();

})();
