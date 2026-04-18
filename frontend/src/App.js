import "./fonts/SanFranciscoProDisplay/fonts.css";
import "./App.css";

import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";

import { Header, Footer, ProtectedRoute } from "./components";
import api from "./api";
import styles from "./styles.module.css";

import {
  SignIn,
  SignUp,
  Favorites,
  Subscriptions,
  User,
  ChangePassword,
  NotFound,
  UpdateAvatar,
  ResetPassword,
  Materials,
  MaterialDetail,
  MaterialCreate,
  MaterialEdit,
} from "./pages";

import { AuthContext, UserContext } from "./contexts";

function App() {
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState({});

  const [authError, setAuthError] = useState({ submitError: "" });
  const [registrError, setRegistrError] = useState({ submitError: "" });
  const [changePasswordError, setChangePasswordError] = useState({
    submitError: "",
  });

  const registration = ({
    email,
    password,
    username,
    first_name,
    last_name,
  }) => {
    api
      .signup({ email, password, username, first_name, last_name })
      .then(() => {
        history.push("/signin");
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          setRegistrError({ submitError: errors.join(", ") });
        }
        setLoggedIn(false);
      });
  };

  const authorization = ({ email, password }) => {
    api
      .signin({ email, password })
      .then((res) => {
        if (res.auth_token) {
          localStorage.setItem("token", res.auth_token);

          api
            .getUserData()
            .then((userData) => {
              setUser(userData);
              setLoggedIn(true);
              history.push("/materials");
            })
            .catch((err) => {
              console.error(err);
              setLoggedIn(false);
              history.push("/signin");
            });
        } else {
          setLoggedIn(false);
        }
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          setAuthError({ submitError: errors.join(", ") });
        }
        setLoggedIn(false);
      });
  };

  const onSignOut = () => {
    api
      .signout()
      .then(() => {
        localStorage.removeItem("token");
        setUser({});
        setLoggedIn(false);
        history.push("/materials");
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          alert(errors.join(", "));
        }
      });
  };

  const changePassword = ({ new_password, current_password }) => {
    api
      .changePassword({ new_password, current_password })
      .then(() => {
        history.push("/signin");
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          setChangePasswordError({ submitError: errors.join(", ") });
        }
      });
  };

  const changeAvatar = ({ file }) => {
    api
      .changeAvatar({ file })
      .then((res) => {
        setUser({
          ...user,
          avatar: res.avatar,
        });
        history.push("/materials");
      })
      .catch((err) => {
        const { non_field_errors } = err;
        if (non_field_errors) {
          return alert(non_field_errors.join(", "));
        }

        const errors = Object.values(err);
        if (errors) {
          alert(errors.join(", "));
        }
      });
  };

  const onPasswordReset = ({ email }) => {
    api
      .resetPassword({ email })
      .then(() => {
        history.push("/signin");
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          alert(errors.join(", "));
        }
        setLoggedIn(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api
        .getUserData()
        .then((userData) => {
          setUser(userData);
          setLoggedIn(true);
        })
        .catch((err) => {
          console.error(err);
          localStorage.removeItem("token");
          setLoggedIn(false);
          history.push("/materials");
        });
    } else {
      setLoggedIn(false);
    }
  }, [history]);

  if (loggedIn === null) {
    return <p>Загрузка...</p>;
  }

  return (
    <AuthContext.Provider value={loggedIn}>
      <UserContext.Provider value={user}>
        <div className={styles.app}>
          <Header loggedIn={loggedIn} onSignOut={onSignOut} />

          <Switch>
            <Route exact path="/">
              <Redirect to="/materials" />
            </Route>

            <Route exact path="/materials">
              <Materials />
            </Route>

            <Route exact path="/materials/:id">
              <MaterialDetail user={user} />
            </Route>

            <ProtectedRoute
              exact
              path="/materials/create"
              component={MaterialCreate}
              loggedIn={loggedIn}
            />

            <ProtectedRoute
              exact
              path="/materials/:id/edit"
              component={MaterialEdit}
              loggedIn={loggedIn}
            />

            <Route exact path="/signin">
              <SignIn
                onSignIn={authorization}
                error={authError}
              />
            </Route>

            <Route exact path="/signup">
              <SignUp
                onSignUp={registration}
                error={registrError}
              />
            </Route>

            <ProtectedRoute
              exact
              path="/favorites"
              component={Favorites}
              loggedIn={loggedIn}
            />

            <ProtectedRoute
              exact
              path="/subscriptions"
              component={Subscriptions}
              loggedIn={loggedIn}
            />

            <ProtectedRoute
              exact
              path="/users/:id"
              component={User}
              loggedIn={loggedIn}
            />

            <ProtectedRoute
              exact
              path="/change-password"
              component={ChangePassword}
              loggedIn={loggedIn}
              onChangePassword={changePassword}
              error={changePasswordError}
            />

            <ProtectedRoute
              exact
              path="/update-avatar"
              component={UpdateAvatar}
              loggedIn={loggedIn}
              onAvatarChange={changeAvatar}
            />

            <Route exact path="/reset-password">
              <ResetPassword onPasswordReset={onPasswordReset} />
            </Route>

            <Route path="*">
              <NotFound />
            </Route>
          </Switch>

          <Footer />
        </div>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;