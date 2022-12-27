import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";

function CreatePostModal() {
  const { user } = useSelector(state => state.user);
  const { createPostModal } = useSelector(state => state.modal);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);
  const [modalNo, setModalNo] = useState(0);
  const [imgsEditModal, setImgsEditModal] = useState(false);
  const [previewImgNo, setPreviewImgNo] = useState(0);
  const [caption, setCaption] = useState("");

  // handle file change at first modal //

  const handleFileChange = e => {
    const files = Array.from(e.target.files);

    // setImages([]);

    files.forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages(old => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });

    setModalNo(1);
  };

  // handle images updation at second modal //

  const handleAddImage = e => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages(old => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImgDeletion = e => {
    setImages(prev => prev.filter(item => item !== e));
  };

  // handle post submission at final modal //

  const handlePostSubmit = async () => {
    setLoading(true);
    await axios.post("/api/v1/create", { caption, images }, { headers: { "Content-Type": "application/json" } }).then(res => {
      setCaption("");
      setImages([]);
      setLoading(false);
      dispatch({ type: "TOGGLE_CREATE_POST_MODAL" });
      window.location.reload();
    });
  };

  return (
    <Container createPostModal={createPostModal} modalNo={modalNo}>
      {/* 1st modal for selecting images from computer */}

      {(images.length === 0 || modalNo === 0) && (
        <>
          <Header style={{ justifyContent: "center" }}>
            <span style={{ fontWeight: "500" }}>Create new post</span>
          </Header>
          <hr style={{ margin: "0" }} />

          <ImageInputContainer>
            <i class="fa-regular fa-image"></i>
            <span>Select photos here</span>
            <button className="btn btn-primary">
              <label htmlFor="images">Select from computer</label>
            </button>
            <input type="file" name="images" id="images" accept="image/*" multiple style={{ display: "none" }} onChange={handleFileChange} />
          </ImageInputContainer>
        </>
      )}

      {/* 2nd modal for changing selected images */}

      {images.length > 0 && modalNo === 1 && (
        <>
          <Header>
            <i
              class="fa-solid fa-arrow-left"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setModalNo(0);
              }}
            ></i>
            <span style={{ fontWeight: "500" }}>Images preview</span>
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setModalNo(2);
              }}
            >
              next
            </span>
          </Header>
          <hr style={{ margin: "0" }} />
          <PreviewImagesContainer>
            <img src={images[previewImgNo]} alt="images-preview" />
            <EditImagesBtn
              onClick={() => {
                setImgsEditModal(prev => {
                  return !prev;
                });
              }}
            >
              <i class="fa-regular fa-images"></i>
            </EditImagesBtn>
            {imgsEditModal && (
              <EditImagesContainer>
                {images &&
                  images.map((item, index) => {
                    return (
                      <EditImagePreview>
                        <i
                          class="fa-regular fa-circle-xmark"
                          onClick={() => {
                            handleImgDeletion(item);
                          }}
                        ></i>
                        <img
                          src={item}
                          alt="images-preview-edit"
                          onClick={() => {
                            setPreviewImgNo(index);
                          }}
                        />
                      </EditImagePreview>
                    );
                  })}
                <AddImageLabel htmlFor="addImage">
                  <i class="fa-solid fa-plus"></i>
                </AddImageLabel>
                <input type="file" name="addImage" id="addImage" accept="image/*" multiple style={{ display: "none" }} onChange={handleAddImage} />
              </EditImagesContainer>
            )}
          </PreviewImagesContainer>
        </>
      )}
      {modalNo === 2 && user && (
        <>
          <Header>
            <i
              class="fa-solid fa-arrow-left"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setModalNo(1);
              }}
            ></i>
            <span style={{ fontWeight: "500" }}>Create new post</span>
            <button className="btn btn-primary" style={{ cursor: "pointer" }} onClick={handlePostSubmit} disabled={loading ? true : false}>
              Share
            </button>
          </Header>
          <hr />
          <FinalContainer>
            <ImagesCarousel>
              <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <img src={images[0]} alt="imagePreview-0" />
                  </div>
                  {images.length > 1 &&
                    images.map((item, index) => {
                      if (index > 0) {
                        return (
                          <div class="carousel-item">
                            <img src={item} alt={`imagePreview-${index}`} />
                          </div>
                        );
                      }
                    })}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
            </ImagesCarousel>
            <CaptionContainer>
              <CaptionHeader>
                <img src={user.avatar.url} />
                <span>{user.name}</span>
              </CaptionHeader>
              <Textarea
                placeholder="Write a caption..."
                rows={10}
                value={caption}
                onChange={e => {
                  setCaption(e.target.value);
                }}
              ></Textarea>
            </CaptionContainer>
          </FinalContainer>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  width: ${props => (props.modalNo === 2 ? "65rem" : "40rem")};
  height: 40rem;
  margin: auto;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  position: fixed;
  z-index: 1000;
  display: ${props => (props.createPostModal ? "" : "none")};
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;
const ImageInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10rem;
  span {
    margin-bottom: 3rem;
    font-size: 2rem;
    font-weight: 300;
  }
  i {
    font-size: 4rem;
  }
  button {
    width: 25rem;
  }
`;
const PreviewImagesContainer = styled.div`
  display: flex;
  position: relative;
  img {
    width: 100%;
    height: 35rem;
    object-fit: contain;
  }
`;
const EditImagesBtn = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  padding: 11px 10px;
  display: flex;
  align-items: center;
  right: 1rem;
  bottom: 0rem;
  i {
    font-size: 1.2rem;
    color: white;
  }
`;
const EditImagesContainer = styled.div`
  height: 10rem;
  width: 93%;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  display: flex;
  align-items: center;
  right: 1rem;
  bottom: 3rem;
  padding: 0 0.5rem;
  overflow-x: scroll;
`;
const EditImagePreview = styled.div`
  position: relative;
  i {
    position: absolute;
    right: 0.3rem;
    top: 0.3rem;
    font-size: 1.2rem;
  }
  img {
    height: 6rem;
    margin: 0 0.2rem;
  }
`;
const AddImageLabel = styled.label`
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 1.2rem 1.5rem;
  display: flex;
  text-align: center;
  margin-left: 0.5rem;
  i {
    color: white;
    font-size: 2rem;
  }
`;
const FinalContainer = styled.div`
  display: flex;
  flex: 1;
`;
const ImagesCarousel = styled.div`
  flex: 0.6;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
  img {
    width: 100%;
    height: 35rem;
    object-fit: contain;
  }
`;
const CaptionContainer = styled.div`
  flex: 0.4;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;
const CaptionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  img {
    width: 3rem;
    height: 3rem;
    object-fit: contain;
  }
  span {
    font-weight: 500;
    font-size: 1rem;
    margin-left: 1rem;
  }
`;
const Textarea = styled.textarea`
  outline: none;
  border: none;
  resize: none;
`;

export default CreatePostModal;
