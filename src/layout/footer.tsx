import React from 'react';

const Footer = () => {
    return (
        <footer id='footer'>
            <h2 className='notext' style={{display: 'none'}}>푸터영역</h2>
            <div className='footer_wrap'>
                <div className='footbanner'>

                </div>
                <div className='section'>
                    {/*logo*/}
                    <div id='logo' className='black'>
                        <a href='#' aria-label='홈'></a>
                    </div>
                    <div className='footer_info'>
                        <p className='address'>(61954) 광주광역시 서구 천변우하로 181 TEL.062.601.1311 FAX.062.601.1313</p>
                        <p className='copyright'>© 2023 Gwangju Climate & Energy Agency. All Rights Reserved.</p>
                    </div>
                    <div className='footer_sns'>
                        <ul>
                            <li>
                                <a href='#' aria-label='페이스북'></a>
                            </li>
                            <li>
                                <a href='#' aria-label='인스타그램'></a>
                            </li>
                            <li>
                                <a href='#' aria-label='유튜브'></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;