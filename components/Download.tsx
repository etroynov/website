import ErrorIcon from "@mui/icons-material/Error";
import { Button, Link, Skeleton } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { useGithubReleases } from "../hooks/useGithubReleases";

const Card = styled.div<{ isError?: boolean }>`
  display: flex;
  flex-direction: row;
  border-radius: 13px;
  max-width: ${({ isError }) => (isError ? 450 : 950)}px;
  max-height: 350px;
  width: 90%;
  margin: 0 auto;
  background: ${({ theme }) => theme.background.backgroundColorLight};
  box-shadow: 0px 1px 7px 1px rgb(0 0 0 / 14%), 0 3px 3px -2px rgb(0 0 0 / 20%),
    0 1px 8px 0 rgb(0 0 0 / 12%);

  @media (max-width: 980px) {
    flex-direction: column;
    max-height: unset;
  }
`;

const Latest = styled.div`
  flex: 1.2;
  padding: 0 28px;

  @media (max-width: 980px) {
    padding-bottom: 20px;
  }
`;

const Older = styled.div`
  background: ${({ theme }) => theme.background.backgroundColorContrast};
  border-radius: 13px;
  padding: 0 16px;
  flex: 1;
  overflow: auto;
  box-shadow: 0px 1px 7px 1px rgb(0 0 0 / 14%), 0 3px 3px -2px rgb(0 0 0 / 20%),
    0 1px 8px 0 rgb(0 0 0 / 12%);
`;

const TextContainer = styled.div`
  position: relative;
  padding-bottom: 35px;
`;

const Header = styled.h1`
  margin: 17px 0 0;
  color: ${({ theme }) => theme.text.textColorLight};
`;

const OlderHeader = styled.h1`
  margin: 17px 0 0;
  text-align: center;
  color: ${({ theme }) => theme.text.textColorLight};
`;

const ReleaseName = styled.span`
  display: block;
  margin: 0 0 20px;
  color: ${({ theme }) => theme.text.textColor}9d;
`;

const Changelogs = styled.p`
  color: ${({ theme }) => theme.text.textColor};

  white-space: pre-line;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const UpdateContainer = styled.div`
  padding: 20px 0 0;
`;

const ReadMoreButton = styled(Button)`
  position: absolute;
  right: 0;
  bottom: 0;
  color: ${({ theme }) => theme.text.textColor};
  padding: 5px 10px;
  border-radius: 3px;
`;

const StyledButton = styled(Button)<{ disableGradient?: boolean }>`
  padding: 7px 20px;
  border-radius: 5px;
  color: ${({ theme }) => theme.text.textColorLight};
  text-decoration: none;

  &:first-child {
    color: ${({ theme }) => theme.text.textColorLight};
    margin-right: 0;

    ${({ disableGradient, theme }) =>
      !disableGradient
        ? `
      margin-right: 15px;
        color: ${theme.text.textColorExtremelyLight};
        background: linear-gradient(
          153deg,
          ${theme.accent.accentColor} 0%,
          ${theme.accent.accentColorLight} 100%
        );

        background-size: 400% 400;
        transition: 0.2s ease-in-out;
        `
        : null}
  }

  &:hover {
    background-position: 100% 50%;
  }
`;

const OlderUpdate = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 6px;
  margin-bottom: 6px;
  border-bottom: 1px solid ${({ theme }) => theme.text.textColorDark}9d;

  &:last-child {
    margin-bottom: 0;
    border-bottom: unset;
  }
`;

const OlderUpdateTextWrapper = styled.div`
  flex-grow: 1;
`;

const OlderUpdateTitle = styled.h1`
  font-size: 1.25rem;
  margin: 0;
  font-weight: 400;
  color: ${({ theme }) => theme.text.textColor};
`;

const ButtonContainer = styled.div`
  margin: 0;
`;

const OlderUpdateDate = styled.span`
  color: ${({ theme }) => theme.text.textColorDark};
`;

const OlderBtns = styled.div`
  display: inline-flex;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const StyledErrorIcon = styled(ErrorIcon)`
  color: ${({ theme }) => theme.error.light};
  width: 50px;
  height: auto;
  margin-top: 25px;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.text.textColor};
  max-width: ch(75);
  margin-bottom: 25px;
`;

interface IDownloadProps {
  showMore?: boolean;
}

const Download = ({ showMore }: IDownloadProps) => {
  const { releases, isError, isLoading } = useGithubReleases();

  const getDate = (date: Date) => {
    date = new Date(date);

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      {isError ? (
        <Card isError>
          <ErrorContainer>
            <StyledErrorIcon />
            <br />
            <ErrorMessage>
              An error occurred whilst fetching GitHub&apos;s API!
            </ErrorMessage>
          </ErrorContainer>
        </Card>
      ) : null}

      {releases?.length ? (
        <>
          <Card>
            <Latest>
              <TextContainer>
                <Header>Latest</Header>
                <ReleaseName>
                  {releases[0].name} ({getDate(releases[0].published_at)})
                </ReleaseName>
                <Changelogs>
                  {releases[0].body
                    .substring(releases[0].body.indexOf("+ "))
                    .replace(/(?:\r\n|\r|\n)/g, "\n")}
                </Changelogs>
                <Link href={releases[0].html_url} target="_blank">
                  <ReadMoreButton>Read more</ReadMoreButton>
                </Link>
              </TextContainer>
              <ButtonContainer>
                {releases[0].assets.map(asset => (
                  <StyledButton
                    key={asset.name}
                    href={asset.browser_download_url}
                  >
                    {asset.name.includes("efi")
                      ? "Download (EFI)"
                      : "Download (Legacy)"}
                  </StyledButton>
                ))}
              </ButtonContainer>
            </Latest>
            <Older>
              <TextContainer>
                <OlderHeader>Older updates</OlderHeader>
                <UpdateContainer>
                  {releases.map((oldRelease, i) => {
                    if (i === 0 || i > 4) return;

                    return (
                      <OlderUpdate key={i}>
                        <OlderUpdateTextWrapper>
                          <OlderUpdateTitle>{oldRelease.name}</OlderUpdateTitle>
                          <OlderUpdateDate>
                            {getDate(oldRelease.published_at)}
                          </OlderUpdateDate>
                        </OlderUpdateTextWrapper>
                        <OlderBtns>
                          {oldRelease.assets.map(asset => (
                            <StyledButton
                              key={asset.name}
                              href={asset.browser_download_url}
                              disableGradient={!asset.name.includes("efi")}
                            >
                              {asset.name.includes("efi") ? "EFI" : "Legacy"}
                            </StyledButton>
                          ))}
                        </OlderBtns>
                      </OlderUpdate>
                    );
                  })}
                </UpdateContainer>
              </TextContainer>
            </Older>
          </Card>
        </>
      ) : isLoading ? (
        <Card>
          <Latest>
            <TextContainer>
              <Header>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={"25%"}
                  height={50}
                />
              </Header>
              <ReleaseName>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={"48%"}
                  height={25}
                />
              </ReleaseName>
              <Changelogs>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={"100%"}
                  height={20}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={"98%"}
                  height={20}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={"95%"}
                  height={20}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={"93%"}
                  height={20}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={"87%"}
                  height={20}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={"85%"}
                  height={20}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={"20%"}
                  height={20}
                />
              </Changelogs>
              <Link target="_blank">
                <ReadMoreButton>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width={100}
                    height={55}
                  />
                </ReadMoreButton>
              </Link>
            </TextContainer>
            <ButtonContainer>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={"20%"}
                height={35}
                style={{ display: "inline-block" }}
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={"20%"}
                height={35}
                style={{ display: "inline-block", marginLeft: 15 }}
              />
            </ButtonContainer>
          </Latest>
          <Older>
            <TextContainer>
              <OlderHeader>Older updates</OlderHeader>
              <UpdateContainer>
                {[...Array(5)].map((oldRelease, i) => {
                  if (i === 0 || i > 4) return;

                  return (
                    <OlderUpdate key={i}>
                      <OlderUpdateTextWrapper>
                        <OlderUpdateTitle>
                          <Skeleton
                            variant="text"
                            animation="wave"
                            width={"25%"}
                            height={25}
                          />
                        </OlderUpdateTitle>
                        <OlderUpdateDate>
                          <Skeleton
                            variant="text"
                            animation="wave"
                            width={"25%"}
                            height={20}
                          />
                        </OlderUpdateDate>
                      </OlderUpdateTextWrapper>
                      <OlderBtns>
                        <Skeleton
                          variant="rectangular"
                          animation="wave"
                          width={"20%"}
                          height={15}
                          style={{ display: "inline-block" }}
                        />
                        <Skeleton
                          variant="rectangular"
                          animation="wave"
                          width={"20%"}
                          height={15}
                          style={{ display: "inline-block", marginLeft: 15 }}
                        />
                      </OlderBtns>
                    </OlderUpdate>
                  );
                })}
              </UpdateContainer>
            </TextContainer>
          </Older>
        </Card>
      ) : null}
      {/* Will implement soon */}
      {showMore ? null : null}
    </>
  );
};

export default Download;
