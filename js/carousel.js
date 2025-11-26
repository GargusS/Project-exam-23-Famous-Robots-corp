if (document.getElementById("carousel")) {
  async function fetchData() {
    try {
      const apiUrl = "https://picsum.photos/v2/list";
      const resp = await fetch(apiUrl);     


      if (!resp.ok) {
        throw new Error("4-oh-4, Oops something went wrong here");
      }

      const dataArray = await resp.json();
      const postsContainer = document.getElementById("dataArray");
      const loader = document.querySelector(".loader");

      async function fetchDataFromMediaURL(url, post) {
        try {
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`Failed to fetch media data. Status: ${response.status}`);
          }

          const mediaData = await response.json();
          return mediaData.alt_text || "Picture of a robot from the article";
        } catch (error) {
          console.error("Error fetching media data:", error.message);
          return "Default Alt Text";
        }
      }
        
      function createPostContainer(post, className) {
        const { author, id } = post;
        const postContainer = document.createElement("div");
        postContainer.className = className;

        const h2 = document.createElement("h2");
        h2.innerHTML = author.rendered;
        const img = document.createElement("img");
        img.setAttribute("src", url);
  

        // Fetch alt text for the image
        fetchDataFromMediaURL(post._links["wp:featuredmedia"][0].href, post)
          .then((altText) => img.setAttribute("alt", altText))
          .catch((error) => console.error("Error setting alt text:", error));

        const postId = document.createElement("div");
        postId.innerHTML = id.rendered;

        // Add onclick event to open details.html
        postContainer.onclick = function () {
          window.location.href = `html/details.html?id=${post.id}`;
        };

        postContainer.append(h2, img, postId);
        postsContainer.appendChild(postContainer);
      }

      await Promise.all(
        dataArray.map(async (item) => {
          createPostContainer(item, "blog-item");
        })
      );

      const imagesToLoad = postsContainer.querySelectorAll("img");
      let imagesLoaded = 0;
      const totalImages = imagesToLoad.length;

      imagesToLoad.forEach((img) => {
        img.addEventListener("load", () => {
          imagesLoaded++;

          if (imagesLoaded === totalImages) {
            loader.classList.add("hidden");

            const width = window.innerWidth;

            if (width <= 600) {
              postsContainer.innerHTML = "";
              dataArray.forEach((post) => {
                const mobileItemContainer = createPostContainer(post, "mobile-item");
                postsContainer.appendChild(mobileItemContainer);
              });
            } else {
              initializeSlider();
            }
          }
        });
      });
    } catch (err) {
      const error = document.getElementById("main");
      error.innerText = err;
    }
  }

  function initializeSlider() {
    const blogItems = Array.from(document.querySelectorAll(".blog-item"));

    let currentSlide = 0;
    let itemsToShow;

    // Function to update itemsToShow based on screen width
    function updateItemsToShow() {
      if (window.innerWidth < 800) {
        itemsToShow = 1; // Show 1 slide for screens below 960px
      } else if (window.innerWidth < 1120) {
        itemsToShow = 2; // Show 2 slides for screens between 960px and 1119px
      } else if (window.innerWidth < 1440) {
        itemsToShow = 3; // Show 3 slides for screens between 1120px and 1439px
      } else {
        itemsToShow = 4; // Show 4 slides for screens 1440px and above
      }

      // Call function to update the slider here
      showPost();
    }

    // Initial calculation
    updateItemsToShow();

    // Event listener for window resize
    window.addEventListener("resize", updateItemsToShow);

    const sliderNav = document.getElementById("dataArray");
    const navLeft = document.createElement("div");
    const navRight = document.createElement("div");

    sliderNav.prepend(navLeft);
    navLeft.className = "nav nav-left";

    sliderNav.append(navRight);
    navRight.className = "nav nav-right";

    const iconLeft = document.createElement("img");
    iconLeft.src = "./assets/arrow-left.png";
    iconLeft.alt = "Left navigation arrow";

    const iconRight = document.createElement("img");
    iconRight.src = "./assets/arrow-right.png";
    iconRight.alt = "Right navigation arrow";

    document.getElementsByClassName("nav-left")[0].appendChild(iconLeft);
    iconLeft.className = "carousel-arrow-icon-left";

    document.getElementsByClassName("nav-right")[0].appendChild(iconRight);
    iconRight.className = "carousel-arrow-icon-right";

    function showPost() {
      const startIndex = currentSlide * itemsToShow;
      const endIndex = startIndex + itemsToShow;

      blogItems.forEach((post, index) => {
        if (index >= startIndex && index < endIndex) {
          post.style.display = "block";
          post.classList.add("active");
        } else {
          post.style.display = "none";
          post.classList.remove("active");
        }
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % Math.ceil(blogItems.length / itemsToShow);
      showPost();
    }

    function prevSlide() {
      currentSlide =
        (currentSlide - 1 + Math.ceil(blogItems.length / itemsToShow)) %
        Math.ceil(blogItems.length / itemsToShow);
      showPost();
    }

    document.querySelector(".nav-left").addEventListener("click", prevSlide);
    document.querySelector(".nav-right").addEventListener("click", nextSlide);

    showPost();
  }

  // Call the fetchData function to start the process
  fetchData();
}
