import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Link,
  Divider,
  Theme,
  makeStyles,
  Tooltip,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { Skeleton, Alert } from "@material-ui/lab";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 400,
    margin: "0 auto",
    background: theme.palette.secondary.light,
    boxShadow: theme.shadows[10],
    marginBottom: 100,
    borderRadius: 8,
  },
  title: {
    position: "relative",
    textAlign: "center",
  },
  cardTitle: {
    display: "inline-block",
    textAlign: "center",
    fontSize: "2em",
  },
  infoIcon: {
    display: "inline-block",
    position: "absolute",
    cursor: "pointer",
    fontSize: "2em",
    right: 10,
    top: 7,
  },
  cardInfo: {
    fontSize: "1em",
    whiteSpace: "pre-line",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 7,
    "-webkit-box-orient": "vertical",
    paddingBottom: 2,
    overflow: "hidden",
  },
  cardLink: {
    display: "block",
    position: "relative",
  },
  cardMore: {
    right: 0,
    color: theme.palette.grey[600],
    position: "absolute",
    transition: `${theme.transitions.easing.easeInOut} 0.229s`,

    "&:hover": {
      color: theme.palette.grey[400],
    },
  },
  btns: {
    display: "block",
    textAlign: "center",
  },
  divider: {
    marginTop: 32,
  },
  downloadBtn: {
    color: theme.palette.primary.light,
    border: `${theme.palette.secondary.light} solid 2px`,
  },
  space: {
    display: "block",
    paddingTop: 5,
  },
}));
interface Releases {
  [index: number]: {
    name: string;
    tag_name: string;
    body: string;
    assets: [
      {
        browser_download_url: string;
      }
    ];
    assets_url: string;
    html_url: string;
    created_at: string;
  };
}

export const Download = () => {
  const classes = useStyles();
  const [release, setRelease] = useState<Releases | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    void fetch("https://api.github.com/repos/dahliaOS/releases/releases")
      .then(async (res) => {
        const releases = await res.json();

        if (res.status >= 400) throw new Error(releases);

        console.log(releases as Releases);
        console.log(
          releases[0].assets.find((el: any) => el.name.includes("-legacy")).url
        );
        return releases as Releases;
      })
      .then((release) => {
        setTimeout(() => {
          setRelease(release);
        }, 1000);
      })
      .catch(setError);
  }, []);

  return (
    <Card className={classes.root}>
      {error ? (
        <Alert severity='error'>
          An error occurred whilst fetching GitHub's API!
        </Alert>
      ) : (
        <div>
          <CardContent>
            <div className={classes.title}>
              <Typography className={classes.cardTitle}>Latest</Typography>
              <Tooltip title={release ? release[0].name : "Loading..."}>
                <InfoIcon className={classes.infoIcon} />
              </Tooltip>
            </div>
            <p className={classes.cardInfo}>
              {release ? (
                /* This long regex basically takes '+ ' and slices it and puts a new line on it */
                release[0].body
                  .substring(release[0].body.indexOf("+ "))
                  .replace(/(?:\r\n|\r|\n)/g, "\n")
              ) : (
                <div>
                  <Skeleton
                    variant='rect'
                    animation='wave'
                    width={"100%"}
                    height={15}
                  />
                  <div className={classes.space} />
                  <Skeleton
                    variant='rect'
                    animation='wave'
                    width={"100%"}
                    height={15}
                  />
                  <div className={classes.space} />
                  <Skeleton
                    variant='rect'
                    animation='wave'
                    width={"98%"}
                    height={15}
                  />
                  <div className={classes.space} />
                  <Skeleton
                    variant='rect'
                    animation='wave'
                    width={"95%"}
                    height={15}
                  />
                  <div className={classes.space} />
                  <Skeleton
                    variant='rect'
                    animation='wave'
                    width={"85%"}
                    height={15}
                  />
                  <div className={classes.space} />
                  <Skeleton
                    variant='rect'
                    animation='wave'
                    width={"20%"}
                    height={15}
                  />
                  <div className={classes.space} />
                </div>
              )}
            </p>
            {release ? (
              <Link href={release[0].html_url} className={classes.cardLink}>
                <Button className={classes.cardMore}>Read more</Button>
              </Link>
            ) : (
              <Link href='' className={classes.cardLink}>
                <Button className={classes.cardMore}>
                  <Skeleton
                    variant='rect'
                    animation='wave'
                    width={"60px"}
                    height={"25px"}
                  />
                </Button>
              </Link>
            )}
          </CardContent>
          <Divider className={classes.divider} />
          <CardActions className={classes.btns}>
            {release ? (
              <div>
                {release[0].assets.length >= 2 ? (
                  <div>
                    <Button
                      href={
                        release[0].assets.find((el: any) =>
                          el.name.includes("-efi")
                        )?.browser_download_url ?? "Oopsies!"
                      }
                      className={classes.downloadBtn}
                    >
                      Download (EFI)
                    </Button>
                    <Button
                      href={
                        release[0].assets.find((el: any) =>
                          el.name.includes("-legacy")
                        )?.browser_download_url ?? "Oopsies!"
                      }
                      className={classes.downloadBtn}
                    >
                      Download (Legacy)
                    </Button>
                  </div>
                ) : (
                  <Button className={classes.downloadBtn}>
                    Download (EFI)
                  </Button>
                )}
              </div>
            ) : (
              <div>
                <Button className={classes.downloadBtn}>
                  <Skeleton
                    variant='rect'
                    animation='wave'
                    width={"90px"}
                    height={"25px"}
                  />
                </Button>
                <Button className={classes.downloadBtn}>
                  <Skeleton
                    variant='rect'
                    animation='wave'
                    width={"90px"}
                    height={"25px"}
                  />
                </Button>
              </div>
            )}
          </CardActions>
        </div>
      )}
    </Card>
  );
};
