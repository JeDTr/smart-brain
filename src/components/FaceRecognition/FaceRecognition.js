import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) => {
  console.log ('In FaceRecognition JS File');

  return (
    <div className='center ma demo-explorer-media-view'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='Face Recognition' src={imageUrl} width='500px' height='auto'/>
        <div className='absolute bounding-box-container center'>
          {
              box.regions?(box.regions.map((region, i) => {
                const boundingBoxStyle = region.region_info.bounding_box;
                return (
                  <div className='bounding-box-set' key={i}>
                    <div
                      className='bounding-box'
                      style={{
                        top:boundingBoxStyle.top_row * 100 + '%',
                        left: boundingBoxStyle.left_col * 100 + '%',
                        bottom: 100 - boundingBoxStyle.bottom_row * 100 + '%',
                        right: 100 - boundingBoxStyle.right_col * 100 + '%',
                      }}>
                    </div>
                  </div>
                );
              })):''
          }
        </div>
      </div>
    </div>
  );
}

export default FaceRecognition;
