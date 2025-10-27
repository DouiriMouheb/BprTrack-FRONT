import { requestCertification, batchUpdateTicket, getGasPrice, finalizeCertification, batchUpdatePrice, downloadCertificate, updateProofs, batchUpdateCertified } from './dataService';

/**
 * Handles the complete 8-step certification workflow
 * @param {Array} pendingRecords - Array of pending records to certify
 * @param {Function} onStepChange - Callback function called when step changes (stepNumber)
 * @param {Function} onError - Callback function called on error (errorMessage)
 * @returns {Promise<Object>} Result object with success status and data
 */
export const certifyAllRecords = async (pendingRecords, onStepChange, onError) => {
  try {
    if (!pendingRecords || pendingRecords.length === 0) {
      throw new Error('No pending records to certify');
    }

    // Get the first pending record to use its owner
    const owner = pendingRecords[0]?.owner || 'fab';
    const recordIds = pendingRecords.map(record => record._id);
    
    // Format data according to the API structure
    const certificationPayload = {
      owner: owner,
      user: 'admin',
      data: pendingRecords.map(record => ({
        id: record._id,
        toBeCertified: [{
          dati: JSON.stringify(record.dati || [])
        }]
      })),
      hashAlgorithm: 'sha256'
    };

    console.log('Step 1: Certification payload:', certificationPayload);
    
    // STEP 1: Request certification
    onStepChange(0);
    const certResult = await requestCertification(certificationPayload);
    console.log('Step 1 completed - Certification result:', certResult);

    if (!certResult.success || !certResult.data?.result) {
      throw new Error('Certification request failed - no ticket ID received');
    }

    const ticketId = certResult.data.result;

    // STEP 2: Update all records with the ticket ID
    onStepChange(1);
    console.log('Step 2: Updating tickets with ID:', ticketId, 'for records:', recordIds);
    const updateResult = await batchUpdateTicket(ticketId, recordIds);
    console.log('Step 2 completed - Batch update result:', updateResult);

    // STEP 3: Get gas price
    onStepChange(2);
    console.log('Step 3: Fetching gas price...');
    const gasPriceResult = await getGasPrice();
    console.log('Step 3 completed - Gas price result:', gasPriceResult);

    if (!gasPriceResult.success || !gasPriceResult.data?.result) {
      throw new Error('Failed to retrieve gas price information');
    }

    const gasPriceRaw = gasPriceResult.data.result;
    
    // Convert scientific notation to real numbers and then to fixed decimal strings
    const gasPrice = {
      baseFee: Number(gasPriceRaw.baseFee).toFixed(18),
      maxPriorityFeePerGas: Number(gasPriceRaw.maxPriorityFeePerGas).toFixed(18),
      maxFeePerGas: Number(gasPriceRaw.maxFeePerGas).toFixed(18)
    };
    
    console.log('Converted gas prices from scientific notation:', gasPrice);

    // STEP 4: Finalize certification with gas price
    onStepChange(3);
    const finalizePayload = {
      owner: owner,
      user: 'admin',
      gasPrice: {
        baseFee: gasPrice.baseFee,
        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,
        maxFeePerGas: gasPrice.maxFeePerGas
      },
      ticket: ticketId
    };

    console.log('Step 4: Finalizing certification with payload:', finalizePayload);
    const finalizeResult = await finalizeCertification(finalizePayload);
    console.log('Step 4 completed - Finalize result:', finalizeResult);

    if (!finalizeResult.success || !finalizeResult.data?.result) {
      throw new Error('Certification finalization failed - no transaction data received');
    }

    const certificationData = finalizeResult.data.result;

    // STEP 5: Update price information
    onStepChange(4);
    console.log('Step 5: Updating price information...');
    const priceUpdateResult = await batchUpdatePrice(
      certificationData.priceEUR,
      certificationData.changeEUR,
      recordIds
    );
    console.log('Step 5 completed - Price update result:', priceUpdateResult);

    // STEP 6: Download certificate with proofs
    onStepChange(5);
    console.log('Step 6: Downloading certificate with proofs...');
    const certificateResult = await downloadCertificate(owner, ticketId);
    console.log('Step 6 completed - Certificate result:', certificateResult);

    if (!certificateResult.success || !certificateResult.data?.result?.proofs) {
      throw new Error('Failed to download certificate - no proofs received');
    }

    const proofs = certificateResult.data.result.proofs;

    // STEP 7: Update proofs in database
    onStepChange(6);
    console.log('Step 7: Updating proofs in database...');
    const proofsUpdateResult = await updateProofs(proofs);
    console.log('Step 7 completed - Proofs update result:', proofsUpdateResult);

    // STEP 8: Update certified status
    onStepChange(7);
    console.log('Step 8: Updating certified status...');
    const certifiedUpdateResult = await batchUpdateCertified(true, recordIds);
    console.log('Step 8 completed - Certified update result:', certifiedUpdateResult);

    // All steps completed
    onStepChange(8);

    return {
      success: true,
      ticketId,
      recordCount: pendingRecords.length,
      transactionHash: certificationData.transactionHash,
      blockchainURL: certificationData.blockchainURL,
      blockchainName: certificateResult.data.result.blockchainName,
      priceEUR: certificationData.priceEUR,
      changeEUR: certificationData.changeEUR,
      proofsUpdated: proofsUpdateResult.updatedCount,
      certifiedCount: certifiedUpdateResult.modifiedCount || recordIds.length,
      data: finalizeResult
    };

  } catch (error) {
    console.error('Certification workflow error:', error);
    if (onError) {
      onError(error.message);
    }
    throw error;
  }
};
