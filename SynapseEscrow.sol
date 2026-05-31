// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title SynapseEscrow
 * @dev Programmatic milestone-bound escrow contract for Web3 venture funding.
 */
contract SynapseEscrow {
    address public investor;
    address public builder;
    IERC20 public fundingToken;
    
    struct Milestone {
        uint256 payoutAmount;
        bool isReleased;
    }
    
    Milestone[] public milestones;
    uint256 public totalLockedFunds;

    event EscrowInitialized(address indexed investor, address indexed builder, uint256 totalFunds);
    event MilestoneReleased(uint256 indexed milestoneIndex, uint256 amount);

    modifier onlyInvestor() {
        require(msg.sender == investor, "Synapse: Only investor can execute");
        _;
    }

    constructor(
        address _investor,
        address _builder,
        address _tokenAddress,
        uint256[] memory _payoutAmounts
    ) {
        require(_investor != address(0) && _builder != address(0), "Synapse: Zero address error");
        require(_tokenAddress != address(0), "Synapse: Invalid token address");
        require(_payoutAmounts.length > 0, "Synapse: Milestones required");

        investor = _investor;
        builder = _builder;
        fundingToken = IERC20(_tokenAddress);
        
        uint256 calculatedTotal = 0;
        for (uint256 i = 0; i < _payoutAmounts.length; i++) {
            require(_payoutAmounts[i] > 0, "Synapse: Payout must be non-zero");
            milestones.push(Milestone({
                payoutAmount: _payoutAmounts[i],
                isReleased: false
            }));
            calculatedTotal += _payoutAmounts[i];
        }
        totalLockedFunds = calculatedTotal;
    }

    /**
     * @dev Pulls designated funding tokens from the investor wallet to initialize the campaign lock.
     * Must have a prior token allowance set up via standard approve().
     */
    function initializeFunding() external onlyInvestor {
        require(
            fundingToken.transferFrom(investor, address(this), totalLockedFunds),
            "Synapse: Token deposit transfer failed"
        );
        emit EscrowInitialized(investor, builder, totalLockedFunds);
    }

    /**
     * @dev Releases the exact stablecoin payout mapped to a specific verified milestone index.
     * Restricted exclusively to the validated investor wallet.
     */
    function releaseMilestone(uint256 _index) external onlyInvestor {
        require(_index < milestones.length, "Synapse: Index out of array bounds");
        Milestone storage milestone = milestones[_index];
        require(!milestone.isReleased, "Synapse: Milestone parameter already released");

        milestone.isReleased = true;
        require(
            fundingToken.transfer(builder, milestone.payoutAmount),
            "Synapse: Capital distribution to builder failed"
        );

        emit MilestoneReleased(_index, milestone.payoutAmount);
    }

    /**
     * @dev External view helper function to trace total milestone array count lengths.
     */
    function getMilestonesCount() external view returns (uint256) {
        return milestones.length;
    }
}
