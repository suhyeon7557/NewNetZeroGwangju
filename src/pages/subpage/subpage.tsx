import React from 'react';

const SubPage = () => {
    return (
        <div aria-label='기후변화 페이지 영역'>
            <div className='nav_wrap'>
                <div className='nav_inner'>
                    <h3>기후변화</h3>
                    <p>기후변화에 대한 정보를 제공합니다.</p>
                    <div>여기는 이제 네비게이션 만들기</div>
                </div>
            </div>
            <div className='cont_wrap'>
                <p>여기다가 컨텐츠 있는곳</p>
            </div>
        </div>
    );
}

export default SubPage;