export default function Footer() {
  return (
    <footer id="footer" aria-label="푸터">
      <div className="footer_wrap">
        <div className="top_sec">
          <h2 className="logo" aria-label="로고">
            <img src="/images/logo.svg" alt="logo" />
          </h2>
          <ul className="link_list">
            <li>
              <a href="#" className="person_infor">개인정보처리방침</a>
            </li>
            <li>
              <a href="" className="email_reject">이메일주소 무단수집 거부</a>
            </li>
            <li>
              <a href="" className="find_road">찾아오시는 길</a>
            </li>
          </ul>
        </div>
        <div className="agree">
          <div className="agree_list">
            <div className="call_list">
              <p>이용문의</p>
              <span>062-601-1313</span>
            </div>
            <div className="call_list_gray">
              <p>운영시간:09:00 - 18:00 (주말 및 공휴일 휴무)</p>
            </div>
          </div>
          <div className="sns_list">
            <button className="btn_facebook">
              <img src="/images/ic_facebook.svg" alt="facebook" />
            </button>
            <button className="btn_instagram">
              <img src="/images/ic_instagram.svg" alt="instagram" />
            </button>
            <button className="btn_youtube">
              <img src="/images/ic_youtube.svg" alt="youtube" />
            </button>
          </div>
        </div>
        <div className="info">
          <div className="address_list">
            <span>주소:우)61954 광주광역시 서구 천변우하로 181 기후에너지 진흥원</span>
            <span>전화:062-601-1311</span>
            <span>팩스:062-601-1313</span>
          </div>
          <div className="copyright">
            <span>© 2023 Gwangju Climate & Energy Agency. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


