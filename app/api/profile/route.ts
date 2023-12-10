import { fetchQuery } from "@airstack/node";
import { init } from "@airstack/node";
import { NextResponse } from 'next/server';
import { config } from "dotenv";
import { useParams } from 'next/navigation'
config();


export async function GET() {
  if (!process.env.AIRSTACK_API_KEY) {
    throw new Error('AIRSTACK_API_KEY is not defined');
  }
  const params = useParams()
  console.log(params)
  const identity = "vitalik.eth";

  init(process.env.AIRSTACK_API_KEY);
  let query = `
  query GetSocial {
    Wallet(input: {identity: "${identity}", blockchain: ethereum}) {
      addresses
      primaryDomain {
        name
      }
      domains {
        isPrimary
        name
        tokenNft {
          tokenId
          address
          blockchain
        }
      }
      farcasterSocials: socials(input: {filter: {dappName: {_eq: farcaster}}}) {
        isDefault
        blockchain
        profileName
        profileHandle
        followerCount
        followingCount
      }
      lensSocials: socials(input: {filter: {dappName: {_eq: lens}}}) {
        isDefault
        blockchain
        profileName
        profileHandle
        profileImage
        followerCount
        followingCount
        profileImageContentValue {
          image {
            small
          }
        }
      }
    
    }
   
 
  }
  `;

  const { data, error } = await fetchQuery(query);

  const profilePicture  = data?.Wallet?.lensSocials[0]?.profileImageContentValue?.image?.small
  const ens = data?.Wallet?.primaryDomain?.name
  const fcSocial = data?.Wallet?.farcasterSocials[0]?.profileHandle
  const fcfollowerCount = data?.Wallet?.farcasterSocials[0]?.followerCount
  const lcSocial = data?.Wallet?.lensSocials[0]?.profileHandle
  const lcfollowerCount = data?.Wallet?.lensSocials[0]?.followerCount
  const total = fcfollowerCount + lcfollowerCount;

  console.log("data:", data);
  console.log("error:", error);


  return NextResponse.json({ profile: profilePicture, social:[ens,fcSocial,lcSocial], total})
}