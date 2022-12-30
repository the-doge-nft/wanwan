# welcome.

this is an app for running meme competitions on ethereum.

everything happens offchain _except_ settling rewards.

here's what it does.

<ol>
    <li>Upload memes giving them an optional <code>name</code> & <code>description</code</li>
    <li>
    Create competitions with a <code>name</code>, <code>description</code>, <code>maxUserSubmissions</code>, <code>endsAt</code>, <code>curators</code>, and <code>rewards</code>
    <ul>
        <li>rewards can be created for places 1-3 in the competition</li>
        <li>rewards can be any amount of ERC721, ERC1155 or ERC20 tokens</li>
        <li>the competition creator must have reward tokens present when creating the competition, but past this
    the system does not do any further promising that said winners will receive the rewards</li>
        <li>when the competition has completed, the app will prompt the competition creator to sign the correct tx's for settling the rewards</li>
    </ul>
    </li>
    <li>Submit memes to competitions (user can submit as many defined by <code>maxUserSubmissions</code>)</li>
    <li>Up-vote / down-vote on memes in competitions if you are holding a [Doge Pixel](https://pixels.ownthedoge.com/)</li>
</ol>
