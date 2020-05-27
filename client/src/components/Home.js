import React, { PureComponent } from "react";
import "../assets/style.css";
// import Nav from "./Home/Nav";
// import Content from "./Home/Content";
// import Footer from "./Home/Footer";

class Home extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    this.setState({
      email: e.target.email.value,
      password: e.target.password.value,
    });
    console.log(this.state);
  };

  render() {
    return (
      <>
        <div class="banner-area banner-3">
          <div class="overlay dark-overlay"></div>
          <div class="d-table">
            <div class="d-table-cell">
              <div class="container">
                <div class="row">
                  <div class="col-lg-8 m-auto text-center col-sm-12 col-md-12">
                    <div class="banner-content content-padding">
                    <h1 class="subtitle">PROPSTORY</h1>
                      <h1 class="banner-title">
                        Propstory Expense Tracker
                      </h1>
                      <p>
                        We are a leading digital marketing services company
                        focused on the vast Real Estate sector. Our long
                        standing clients include top developers in the country
                      </p>

                      <a href="/users/login" class="btn btn-white btn-circled">
                        lets login
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Home;
